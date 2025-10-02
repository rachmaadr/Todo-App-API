import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach
} from "@jest/globals";

// Mock PrismaClient
const mockPrismaClient = {
  todos: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
};

// Mock PrismaClient module - path yang benar dari tests/unit/ ke prisma/generated/prisma/index.js
jest.unstable_mockModule("../../src/generated/prisma/index.js", () => ({
  PrismaClient: jest.fn(() => mockPrismaClient)
}));

// Import controller setelah mock - path dari tests/unit/ ke src/controllers/todosController.js
const { create, list, getOne, update, remove } = await import(
  "../../src/controllers/TodoController.js"
);

describe("Todos Controller", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    // Reset semua mock
    jest.clearAllMocks();

    // Setup request, response, dan next mock
    mockReq = {
      body: {},
      params: {},
      query: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new todo successfully", async () => {
      // Arrange
      const mockTodo = {
        id: 1,
        title: "Test Todo",
        description: "Test Description",
        status: "pending",
        created_at: new Date()
      };

      mockReq.body = {
        title: "Test Todo",
        description: "Test Description"
      };

      mockPrismaClient.todos.create.mockResolvedValue(mockTodo);

      // Act
      await create(mockReq, mockRes, mockNext);

      // Assert
      expect(mockPrismaClient.todos.create).toHaveBeenCalledWith({
        data: {
          title: "Test Todo",
          description: "Test Description"
        }
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ todo: mockTodo });
    });

    it("should handle errors when creating todo", async () => {
      // Arrange
      const mockError = new Error("Database error");
      mockReq.body = {
        title: "Test Todo",
        description: "Test Description"
      };

      mockPrismaClient.todos.create.mockRejectedValue(mockError);

      // Act
      await create(mockReq, mockRes, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("list", () => {
    it("should return list of todos with pagination", async () => {
      // Arrange
      const mockTodos = [
        { id: 1, title: "Todo 1", status: "pending", created_at: new Date() },
        { id: 2, title: "Todo 2", status: "completed", created_at: new Date() }
      ];

      mockReq.query = { page: "1", limit: "20" };

      mockPrismaClient.todos.findMany.mockResolvedValue(mockTodos);
      mockPrismaClient.todos.count.mockResolvedValue(2);

      // Act
      await list(mockReq, mockRes, mockNext);

      // Assert
      expect(mockPrismaClient.todos.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 20,
        orderBy: { created_at: "desc" }
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockTodos,
        meta: {
          total: 2,
          page: 1,
          limit: 20,
          totalPages: 1
        }
      });
    });

    it("should filter todos by status", async () => {
      // Arrange
      const mockTodos = [
        { id: 1, title: "Todo 1", status: "completed", created_at: new Date() }
      ];

      mockReq.query = { status: "completed", page: "1", limit: "10" };

      mockPrismaClient.todos.findMany.mockResolvedValue(mockTodos);
      mockPrismaClient.todos.count.mockResolvedValue(1);

      // Act
      await list(mockReq, mockRes, mockNext);

      // Assert
      expect(mockPrismaClient.todos.findMany).toHaveBeenCalledWith({
        where: { status: "completed" },
        skip: 0,
        take: 10,
        orderBy: { created_at: "desc" }
      });
    });
  });

  describe("getOne", () => {
    it("should return a todo when found", async () => {
      // Arrange
      const mockTodo = {
        id: 1,
        title: "Test Todo",
        description: "Test Description",
        status: "pending"
      };

      mockReq.params.id = "1";
      mockPrismaClient.todos.findUnique.mockResolvedValue(mockTodo);

      // Act
      await getOne(mockReq, mockRes, mockNext);

      // Assert
      expect(mockPrismaClient.todos.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockTodo);
    });

    it("should return 404 when todo not found", async () => {
      // Arrange
      mockReq.params.id = "999";
      mockPrismaClient.todos.findUnique.mockResolvedValue(null);

      // Act
      await getOne(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "list not found" });
    });
  });

  describe("update", () => {
    it("should update todo successfully", async () => {
      // Arrange
      const mockUpdatedTodo = {
        id: 1,
        title: "Updated Todo",
        description: "Updated Description",
        status: "completed"
      };

      mockReq.params.id = "1";
      mockReq.body = {
        title: "Updated Todo",
        description: "Updated Description",
        status: "completed"
      };

      mockPrismaClient.todos.update.mockResolvedValue(mockUpdatedTodo);

      // Act
      await update(mockReq, mockRes, mockNext);

      // Assert
      expect(mockPrismaClient.todos.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: "Updated Todo",
          description: "Updated Description",
          status: "completed"
        }
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedTodo);
    });

    it("should handle todo not found error", async () => {
      // Arrange
      const mockError = {
        code: "P2025",
        message: "Record to update not found."
      };

      mockReq.params.id = "999";
      mockReq.body = { title: "Updated" };

      mockPrismaClient.todos.update.mockRejectedValue(mockError);

      // Act
      await update(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Todo not found"
      });
    });
  });

  describe("remove", () => {
    it("should delete todo successfully", async () => {
      // Arrange
      mockReq.params.id = "1";
      mockPrismaClient.todos.delete.mockResolvedValue({});

      // Act
      await remove(mockReq, mockRes, mockNext);

      // Assert
      expect(mockPrismaClient.todos.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Deleted successfully"
      });
    });

    it("should handle todo not found error", async () => {
      // Arrange
      const mockError = {
        code: "P2025",
        message: "Record to delete not found."
      };

      mockReq.params.id = "999";
      mockPrismaClient.todos.delete.mockRejectedValue(mockError);

      // Act
      await remove(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Todo not found"
      });
    });
  });
});
