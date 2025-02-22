import "dotenv/config";
import { prisma } from "../prisma/client.js";

export async function getCart(req, res) {
  const { userId } = req.params; // Assuming userId is passed in the route

  // Fetch cart items for the user, including product details and first image
  const cartItems = await prisma.cart.findMany({
    where: {
      userId: String(userId), // Convert to string if necessary
    },
    include: {
      Product: {
        include: {
          images: {
            take: 1, // Fetch only the first image
          },
        },
      },
    },
  });
  if (cartItems.length === 0) {
    return res.status(404).json({ message: "No items in cart." });
  }
  const totalCharge = cartItems.reduce((sum, item) => {
    return sum + item.quantity * item.Product.price;
  }, 0);

  return res.status(200).json({
    cartItems,
    totalCharge, // Send total charge in the response
  });
}

export async function addToCart(req, res) {
  const { userId, productId, quantity } = req.body;
  // Check if the product already exists in the user's cart
  const existingCartItem = await prisma.cart.findUnique({
    where: {
      userId_productId: {
        userId: userId,
        productId: productId,
      },
    },
  });

  if (existingCartItem) {
    // If the product exists, update the quantity
    const updatedCartItem = await prisma.cart.update({
      where: {
        id: existingCartItem.id, // Find by existing cart item ID
      },
      data: {
        quantity: existingCartItem.quantity + quantity, // Add the new quantity to the existing one
      },
    });
    return res.status(200).json(updatedCartItem);
  } else {
    // If the product doesn't exist, create a new cart entry
    const newCartItem = await prisma.cart.create({
      data: {
        userId: userId,
        productId: productId,
        quantity: quantity,
      },
    });
    return res.status(201).json(newCartItem);
  }
}

export async function updateCart(req, res) {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || quantity === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    if (quantity <= 0) {
      // If quantity is 0 or less, remove the item from the cart
      await prisma.cart.deleteMany({
        where: {
          userId,
          productId,
        },
      });
      return res.status(200).json({ message: "Product removed from cart" });
    } else {
      // Check if the product already exists in the cart for the user
      const cartItem = await prisma.cart.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      if (cartItem) {
        // If product already exists in the cart, update the quantity
        await prisma.cart.update({
          where: {
            userId_productId: {
              userId,
              productId,
            },
          },
          data: {
            quantity,
          },
        });
        return res.status(200).json({ message: "Cart updated successfully" });
      } else {
        // If product doesn't exist in the cart, create a new entry
        await prisma.cart.create({
          data: {
            userId,
            productId,
            quantity,
          },
        });
        return res.status(201).json({ message: "Product added to cart" });
      }
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteCart(req, res) {
  const { id } = req.params;
  try {
    await prisma.cart.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error removing item from cart" });
  }
}
