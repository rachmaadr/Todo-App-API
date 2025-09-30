import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const create = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const todo = await prisma.todos.create({
      data: { title, description }
    });
    res.status(201).json({ todo });
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};
    const [todos, total] = await Promise.all([
      prisma.todos.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { created_at: "desc" }
      }),
      prisma.todos.count({ where })
    ]);
    res.json({
      data: todos,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const todo = await prisma.todos.findUnique({ where: { id } });
    if (!todo) {
      return res.status(404).json({ message: "list not found" });
    }
    res.json(todo);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, description, status } = req.body;
    const todo = await prisma.todos.update({
      where: { id },
      data: { title, description, status }
    });
    res.json(todo);
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({
        message: "Todo not found"
      });
    }
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.todos.delete({
      where: { id }
    });
    res.json({
      message: "Deleted successfully"
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Todo not found"
      });
    }
    next(error);
  }
};
