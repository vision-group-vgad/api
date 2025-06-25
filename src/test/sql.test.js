import pool from "../config/db";
import {
  saveSession,
  getSession,
  deleteSession,
  createDepartment,
  createPosition,
  getPositionByName,
  getDeparmentByName,
  createUser,
  updateUserImageByEmail,
  updateUser,
  getUserById,
  deleteUser,
  getAllUsers,
  saveLog,
  getAllLogs,
} from "../config/sql";
import Utils from "../utils/utils";
import { it, expect, afterAll, jest, beforeAll, describe } from "@jest/globals";

describe("SQL Operations", () => {
  beforeAll(() => {
    jest.spyOn(pool, "query").mockImplementation(() => {
      throw new Error("Mocked pool.query");
    });
  });
  afterAll(async () => {
    await pool.end();
  });

  it("inserts a session and returns the inserted row", async () => {
    const mockSessionId = "abc123";
    const mockRow = { id: 1, session_id: mockSessionId };

    const querySpy = jest.spyOn(pool, "query");

    querySpy
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [mockRow] });

    const result = await saveSession(mockSessionId);

    expect(querySpy).toHaveBeenCalledWith(
      "SELECT * FROM sessions WHERE session_id = $1",
      [mockSessionId]
    );

    expect(querySpy).toHaveBeenCalledWith(
      "INSERT INTO sessions (session_id) VALUES ($1) RETURNING *",
      [mockSessionId]
    );

    expect(result).toEqual(mockRow);
  });

  it("returns existing session if already present", async () => {
    const mockSessionId = "abc123";
    const mockRow = { id: 1, session_id: mockSessionId };

    const querySpy = jest.spyOn(pool, "query");

    querySpy.mockResolvedValueOnce({ rows: [mockRow] });

    const result = await saveSession(mockSessionId);

    expect(querySpy).toHaveBeenCalledWith(
      "SELECT * FROM sessions WHERE session_id = $1",
      [mockSessionId]
    );

    expect(result).toEqual(mockRow);
  });

  it("retrieves a session by session ID", async () => {
    const mockSessionId = "abc123";
    const mockResult = { rows: [{ id: 1, session_id: mockSessionId }] };

    jest.spyOn(pool, "query").mockResolvedValue(mockResult);

    const result = await getSession(mockSessionId);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM sessions WHERE session_id = $1",
      [mockSessionId]
    );
    expect(result).toEqual(mockResult);
  });

  it("deletes a session by session ID", async () => {
    const mockSessionId = "abc123";
    const mockResult = { rowCount: 1 };

    jest.spyOn(pool, "query").mockResolvedValue(mockResult);

    const result = await deleteSession(mockSessionId);

    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM sessions WHERE session_id = $1",
      [mockSessionId]
    );
    expect(result).toEqual(mockResult);
  });

  it("creates a department and returns the inserted row", async () => {
    const departmentName = "Engineering";
    const mockRow = { id: 1, name: departmentName };

    const querySpy = jest.spyOn(pool, "query");

    querySpy
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [mockRow] });

    const result = await createDepartment(departmentName);

    expect(querySpy).toHaveBeenCalledWith(
      "SELECT * FROM department WHERE name = $1",
      [departmentName]
    );

    expect(querySpy).toHaveBeenCalledWith(
      "INSERT INTO department (name) VALUES ($1) RETURNING *",
      [departmentName]
    );

    expect(result).toEqual(mockRow);
  });

  it("returns existing department if already present", async () => {
    const departmentName = "Engineering";
    const mockRow = { id: 1, name: departmentName };

    const querySpy = jest.spyOn(pool, "query");

    querySpy.mockResolvedValueOnce({ rows: [mockRow] });

    const result = await createDepartment(departmentName);

    expect(querySpy).toHaveBeenCalledWith(
      "SELECT * FROM department WHERE name = $1",
      [departmentName]
    );

    expect(result).toEqual(mockRow);
  });

  it("creates a position and returns the inserted row", async () => {
    const positionName = "Developer";
    const mockRow = { id: 1, name: positionName };

    const querySpy = jest.spyOn(pool, "query");

    querySpy
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [mockRow] });

    const result = await createPosition(positionName);

    expect(querySpy).toHaveBeenCalledWith(
      "SELECT * FROM position WHERE name = $1",
      [positionName]
    );

    expect(querySpy).toHaveBeenCalledWith(
      "INSERT INTO position (name) VALUES ($1) RETURNING *",
      [positionName]
    );

    expect(result).toEqual(mockRow);
  });

  it("returns existing position if already present", async () => {
    const positionName = "Developer";
    const mockRow = { id: 1, name: positionName };

    const querySpy = jest.spyOn(pool, "query");

    querySpy.mockResolvedValueOnce({ rows: [mockRow] });

    const result = await createPosition(positionName);

    expect(querySpy).toHaveBeenCalledWith(
      "SELECT * FROM position WHERE name = $1",
      [positionName]
    );

    expect(result).toEqual(mockRow);
  });

  it("gets position by name", async () => {
    const positionName = "Manager";
    const mockRow = { id: 1, name: positionName };

    jest.spyOn(pool, "query").mockResolvedValue({ rows: [mockRow] });

    const result = await getPositionByName(positionName);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM position WHERE name = $1",
      [positionName]
    );
    expect(result).toEqual(mockRow);
  });

  it("gets department by name", async () => {
    const departmentName = "HR";
    const mockRow = { id: 2, name: departmentName };

    jest.spyOn(pool, "query").mockResolvedValue({ rows: [mockRow] });

    const result = await getDeparmentByName(departmentName);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM department WHERE name = $1",
      [departmentName]
    );
    expect(result).toEqual(mockRow);
  });

  it("creates user and returns the inserted user row", async () => {
    const email = "test@example.com";
    const firstName = "Test";
    const lastName = "User";
    const departmentName = "Engineering";
    const positionName = "Developer";

    const mockDepartment = { id: 3, name: departmentName };
    const mockPosition = { id: 4, name: positionName };
    const mockUser = {
      id: 1,
      email,
      first_name: firstName,
      last_name: lastName,
      profile_picture: "mocked/path/profile_pic.png",
      department: 3,
      position: 4,
    };

    const poolQueryMock = jest.spyOn(pool, "query");

    poolQueryMock
      .mockResolvedValueOnce({ rows: [mockDepartment] })
      .mockResolvedValueOnce({ rows: [mockPosition] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [mockUser] });

    jest
      .spyOn(Utils, "getImagePath")
      .mockReturnValue("mocked/path/profile_pic.png");

    const result = await createUser(
      email,
      firstName,
      lastName,
      departmentName,
      positionName
    );

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    expect(pool.query).toHaveBeenCalledWith(
      `INSERT INTO users (email, first_name, last_name, profile_picture, department, position)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
      [
        email,
        firstName,
        lastName,
        "mocked/path/profile_pic.png",
        mockDepartment.id,
        mockPosition.id,
      ]
    );

    expect(result).toEqual(mockUser);
  });

  it("returns existing user if already present", async () => {
    const email = "test@example.com";
    const firstName = "Test";
    const lastName = "User";
    const departmentName = "Engineering";
    const positionName = "Developer";

    const mockDepartment = { id: 3, name: departmentName };
    const mockPosition = { id: 4, name: positionName };
    const mockUser = {
      id: 1,
      email,
      first_name: firstName,
      last_name: lastName,
      profile_picture: "mocked/path/profile_pic.png",
      department: 3,
      position: 4,
    };

    const poolQueryMock = jest.spyOn(pool, "query");

    poolQueryMock
      .mockResolvedValueOnce({ rows: [mockDepartment] })
      .mockResolvedValueOnce({ rows: [mockPosition] })
      .mockResolvedValueOnce({ rows: [mockUser] });

    jest
      .spyOn(Utils, "getImagePath")
      .mockReturnValue("mocked/path/profile_pic.png");

    const result = await createUser(
      email,
      firstName,
      lastName,
      departmentName,
      positionName
    );

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    expect(pool.query).not.toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO users"),
      expect.any(Array)
    );

    expect(result).toEqual(mockUser);
  });

  it("updates user image by email and returns updated row", async () => {
    const email = "user@example.com";
    const mockImagePath = "mocked/image/path.png";
    const mockRow = {
      id: 1,
      email,
      profile_picture: mockImagePath,
    };

    jest.spyOn(Utils, "getImagePath").mockReturnValue(mockImagePath);
    jest.spyOn(pool, "query").mockResolvedValue({ rows: [mockRow] });

    const result = await updateUserImageByEmail(email);

    expect(Utils.getImagePath).toHaveBeenCalledWith(email);
    expect(pool.query).toHaveBeenCalledWith(
      `UPDATE users
     SET profile_picture = $1
     WHERE email = $2
     RETURNING *`,
      [mockImagePath, email]
    );
    expect(result).toEqual(mockRow);
  });

  it("updates a user and returns the updated row", async () => {
    const mockUser = {
      user_id: 1,
      email: "user@example.com",
      first_name: "John",
      last_name: "Doe",
      profile_picture: "pic.jpg",
      department: 2,
      position: 3,
    };

    jest.spyOn(pool, "query").mockResolvedValue({ rows: [mockUser] });

    const result = await updateUser(
      mockUser.user_id,
      mockUser.email,
      mockUser.first_name,
      mockUser.last_name,
      mockUser.profile_picture,
      mockUser.department,
      mockUser.position
    );

    expect(pool.query).toHaveBeenCalledWith(
      `UPDATE users
     SET email = $1,
         first_name = $2,
         last_name = $3,
         profile_picture = $4,
         department = $5,
         position = $6
     WHERE user_id = $7
     RETURNING *`,
      [
        mockUser.email,
        mockUser.first_name,
        mockUser.last_name,
        mockUser.profile_picture,
        mockUser.department,
        mockUser.position,
        mockUser.user_id,
      ]
    );

    expect(result).toEqual(mockUser);
  });

  it("retrieves a user by user ID", async () => {
    const userId = 7;
    const mockRow = {
      user_id: userId,
      email: "findme@example.com",
    };

    jest.spyOn(pool, "query").mockResolvedValue({ rows: [mockRow] });

    const result = await getUserById(userId);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );
    expect(result).toEqual(mockRow);
  });

  it("deletes a user by user ID", async () => {
    const userId = 10;
    const mockResult = { rowCount: 1 };

    jest.spyOn(pool, "query").mockResolvedValue(mockResult);

    const result = await deleteUser(userId);

    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM users WHERE user_id = $1",
      [userId]
    );
    expect(result).toEqual(mockResult);
  });

  it("retrieves all users", async () => {
    const mockUsers = [
      { id: 1, email: "a@example.com" },
      { id: 2, email: "b@example.com" },
    ];

    jest.spyOn(pool, "query").mockResolvedValue({ rows: mockUsers });

    const result = await getAllUsers();

    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users");
    expect(result).toEqual(mockUsers);
  });

  it("saves a log and returns the inserted row", async () => {
    const level = "info";
    const message = "This is a test log entry";
    const mockRow = {
      id: 1,
      level,
      message,
      timestamp: new Date().toISOString(),
    };

    const querySpy = jest
      .spyOn(pool, "query")
      .mockResolvedValue({ rows: [mockRow] });

    const result = await saveLog(level, message);

    expect(querySpy).toHaveBeenCalledWith(
      `INSERT INTO logs (level, message, timestamp)
     VALUES ($1, $2, NOW())
     RETURNING *`,
      [level, message]
    );

    expect(result).toEqual(mockRow);
  });

  it("retrieves all logs ordered by timestamp descending", async () => {
    const mockLogs = [
      {
        id: 2,
        level: "error",
        message: "Latest error",
        timestamp: new Date().toISOString(),
      },
      {
        id: 1,
        level: "info",
        message: "Earlier info",
        timestamp: new Date(Date.now() - 10000).toISOString(),
      },
    ];

    const querySpy = jest
      .spyOn(pool, "query")
      .mockResolvedValue({ rows: mockLogs });

    const result = await getAllLogs();

    expect(querySpy).toHaveBeenCalledWith(
      `SELECT * FROM logs
     ORDER BY timestamp DESC`
    );

    expect(result).toEqual(mockLogs);
  });
});
