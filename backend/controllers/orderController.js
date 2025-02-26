import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../prisma/client.js";
import { OrderStatus } from "@prisma/client";

export const checkoutOrder = async (req, res) => {
  const { userId, products, paymentMethod } = req.body; // Products should be an array of { productId, quantity }

  if (!userId || !products || products.length === 0 || !paymentMethod) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let totalAmount = 0;
  const orderItemsData = [];

  for (const item of products) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      return res
        .status(404)
        .json({ error: `Product not found: ${item.productId}` });
    }

    totalAmount += product.price * item.quantity;
    orderItemsData.push({ productId: item.productId, quantity: item.quantity });
  }

  const orderNumber = `ORD-${uuidv4().slice(0, 8)}`;

  const order = await prisma.orders.create({
    data: {
      userId,
      orderNumber,
      totalAmount,
      paymentMethod,
      status: "PENDING",
      orderItems: {
        create: orderItemsData,
      },
    },
    include: {
      orderItems: true,
    },
  });

  res.status(201).json({ message: "Order placed successfully", order });
};
export async function getOrders(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const orders = await prisma.orders.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: {
              // Fetch product details for each order item
              select: {
                id: true,
                name: true,
                price: true,
                images: true, // Assuming images is an array
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!orders.length)
      return res.status(404).json({ message: "No orders found" });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const orders = await prisma.orders.findMany({
      skip,
      take: limitNum,
      include: {
        User: { select: { id: true, name: true, email: true } },
        Product: {
          select: { id: true, name: true, price: true, images: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalOrders = await prisma.orders.count();

    res.status(200).json({
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitNum),
      currentPage: pageNum,
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await prisma.orders.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: "Order not found" });

    const updatedOrder = await prisma.orders.update({
      where: { id: orderId },
      data: { status },
    });

    res.status(200).json({ message: "Order status updated", updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.orders.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.status === OrderStatus.CANCELED) {
      return res.status(400).json({ error: "Order is already canceled" });
    }

    const canceledOrder = await prisma.orders.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELED, canceledAt: new Date() },
    });

    res.status(200).json({ message: "Order canceled", canceledOrder });
  } catch (error) {
    console.error("Error canceling order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
