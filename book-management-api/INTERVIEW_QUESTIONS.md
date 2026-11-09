# Technical Interview Preparation Guide
## Elevate Labs – Web Development Internship (Task 3: Book Management REST API)

This document contains in-depth, interview-ready answers to the most frequent technical questions asked during backend web development assessments and technical interviews.

---

### Section 1: Node.js & Runtime Architecture

#### Q1: How does Node.js handle concurrency if JavaScript is single-threaded?
**Answer:**  
JavaScript executes on a single main thread (call stack), meaning only one line of JavaScript runs at any given moment. However, Node.js achieves high concurrency through the **Event Loop** and **Libuv thread pool**.
- When an asynchronous I/O operation (such as reading a file, network request, or timer) is initiated, Node.js offloads the operation to the operating system kernel or the Libuv worker thread pool.
- The main thread immediately continues executing subsequent code without blocking.
- When the background I/O finishes, its callback is placed into the appropriate event loop phase queue (timers, I/O callbacks, check/setImmediate).
- The Event Loop picks up callbacks when the call stack is empty and executes them. This non-blocking architecture allows a single Node.js instance to handle thousands of concurrent client connections with minimal memory overhead.

#### Q2: What is the difference between CommonJS and ES Modules?
**Answer:**  
- **CommonJS (CJS)**: Uses `require()` and `module.exports`. It is synchronous and dynamic (can be loaded inside `if` statements). It is the traditional standard for Node.js and was used in this project for native out-of-the-box compatibility without transpilations.
- **ES Modules (ESM)**: Uses `import` and `export`. It is asynchronous, statically analyzable at compile-time (enabling tree-shaking), and is the standard for modern browsers and newer Node.js applications (`"type": "module"`).

---

### Section 2: REST Architecture & HTTP Protocol

#### Q3: What makes an API "RESTful"? What are the core constraints of REST?
**Answer:**  
REST (Representational State Transfer) is an architectural style defined by Roy Fielding with six core constraints:
1. **Client-Server Architecture**: Separation of concerns between the client (UI/presentation) and server (data access/business logic).
2. **Statelessness**: Every request from client to server must contain all the information necessary to understand and process the request. The server stores no client session context.
3. **Cacheability**: Responses must define themselves as cacheable or non-cacheable to improve network efficiency.
4. **Uniform Interface**: Resources are identified by standard URIs (`/books`), manipulated through standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`), and represented using standard formats (JSON).
5. **Layered System**: The client cannot tell whether it is connected directly to the end server or an intermediary (load balancer, proxy, cache).
6. **Code on Demand (Optional)**: Server can temporarily extend client functionality by transferring executable code.

#### Q4: What is the difference between Idempotent and Non-Idempotent HTTP methods?
**Answer:**  
An HTTP method is **idempotent** if making the same request multiple times produces the exact same side-effect on the server as making it once.
- `GET`: Safe & Idempotent (only reads data, modifies nothing).
- `PUT`: Idempotent. Sending `PUT /books/1` with `{ "title": "Clean Code", "author": "Robert Martin" }` ten times results in the exact same state as sending it once.
- `DELETE`: Idempotent. Deleting resource `1` the first time removes it; subsequent calls leave it deleted (even if the return status shifts from 200 to 404, the server state remains unchanged).
- `POST`: **Non-Idempotent**. Calling `POST /books` five times will create five distinct new book records with different IDs.

#### Q5: What is the difference between PUT and PATCH?
**Answer:**  
- **`PUT`**: Replaces the entire resource representation. The client must supply all fields of the resource. If a field is omitted, it is typically overwritten with null or default.
- **`PATCH`**: Partial update. The client only sends the specific fields that need to be altered (e.g. `{ "author": "New Author" }`), while preserving existing values for unspecified fields.

---

### Section 3: Express.js Framework & Middleware

#### Q6: What is Express middleware and how does the middleware pipeline work?
**Answer:**  
Middleware functions are functions that have access to the request object (`req`), response object (`res`), and the `next` function in the application’s request-response cycle.

Middleware can:
1. Execute any code (e.g., logging request timestamp and URL).
2. Make changes to the request and response objects (e.g., `express.json()` parses the raw body stream into `req.body`).
3. End the request-response cycle (e.g., `res.status(400).json(...)`).
4. Call `next()` to pass control to the next middleware in the stack.

If a middleware does not end the cycle and forgets to call `next()`, the client request will hang indefinitely until timing out.

#### Q7: How does Express recognize Error-Handling Middleware? Why are 4 parameters required?
**Answer:**  
Express inspects the function's `length` property (the number of declared parameters in its signature). Standard middleware accepts 2 or 3 parameters `(req, res, next)`.
Error-handling middleware **must declare exactly 4 parameters**: `(err, req, res, next)`. Even if `next` is not explicitly called inside the function, omitting it changes `fn.length` to 3, causing Express to treat it as standard request middleware instead of error handler.

#### Q8: How does `express.json()` work internally?
**Answer:**  
In Node.js HTTP servers, the incoming HTTP request body arrives as a stream of raw data chunks (`Buffer`). `express.json()` listens for `data` events on the readable request stream, buffers the chunks, converts them to a UTF-8 string, and calls `JSON.parse()`. If parsing succeeds, it attaches the parsed JavaScript object to `req.body`. If the JSON is invalid syntax, it forwards a `SyntaxError` with status `400` to `next(err)`.

---

### Section 4: HTTP Status Codes & Error Handling

#### Q9: When should you use 200, 201, 204, 400, 404, and 500?
**Answer:**  
- **`200 OK`**: Standard response for successful `GET`, `PUT`, or `DELETE` requests returning a payload.
- **`201 Created`**: The request succeeded and resulted in a new resource being created (`POST /books`).
- **`204 No Content`**: The request succeeded, but there is no response entity body to return (often used in `DELETE` operations).
- **`400 Bad Request`**: Client-side error where the server cannot process the request due to malformed syntax, missing required fields, or validation failures.
- **`401 Unauthorized`**: Authentication is required and has either failed or not yet been provided.
- **`403 Forbidden`**: The server understood the request, but refuses to authorize it (insufficient permissions).
- **`404 Not Found`**: The requested URI does not match any resource on the server.
- **`500 Internal Server Error`**: An unexpected server-side exception or unhandled condition occurred.

---

### Section 5: Data Storage & Scalability

#### Q10: What are the pros and cons of In-Memory storage vs Persistent Databases?
**Answer:**  
- **In-Memory Storage (RAM / Array)**:
  - *Pros*: Microsecond read/write speeds, zero infrastructure dependencies, trivial setup for prototyping and unit testing.
  - *Cons*: **Volatile** — all data is wiped when the process restarts or crashes; limited by server RAM size; cannot be shared across multiple server worker instances or horizontal replicas.
- **Persistent Databases (PostgreSQL / MongoDB)**:
  - *Pros*: Data durability via disk write-ahead logs (WAL), ACID guarantees, relational indexing, concurrent transactions, independent scaling from application compute.
  - *Cons*: Network latency on each query, connection pooling overhead, schema migrations, and hosting operational cost.

#### Q11: How would you transition this API to MongoDB or PostgreSQL?
**Answer:**  
Due to our clean Controller-Route architecture:
1. Replace `src/data/books.js` with an ORM/ODM model (e.g. Mongoose `Book.js` or Drizzle/Prisma schema).
2. In `bookController.js`, update synchronous array methods (`books.push`, `books.find`, `books.splice`) to `async/await` database queries (`Book.find()`, `Book.create()`, `Book.findByIdAndUpdate()`, `Book.findByIdAndDelete()`).
3. The routing definitions (`bookRoutes.js`) and API contract (request/response JSON schemas) remain 100% unchanged for clients!

---

### Section 6: Quality Assurance & Postman Testing

#### Q12: Why are automated tests in Postman valuable, and how do they work?
**Answer:**  
Postman provides a built-in JavaScript sandbox with the Chai assertion library (`pm.test()`, `pm.expect()`). Automated tests verify:
1. Correct HTTP status codes (`pm.response.to.have.status(200)`).
2. Response latency and headers (`Content-Type: application/json`).
3. Schema integrity (ensuring every object has `id`, `title`, and `author`).
4. Contract chaining: dynamically extracting the `id` from a `POST` response and setting it into a collection variable `{{createdBookId}}` to immediately test `PUT` and `DELETE` on the newly created record.
This prevents regressions and allows one-click continuous integration testing via Newman CLI.
