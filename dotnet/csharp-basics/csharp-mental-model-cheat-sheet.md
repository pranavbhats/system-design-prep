# C# Mental Model Cheat Sheet
*For TypeScript/JavaScript/Python developers*

## 🧠 Core Mental Model Shifts

### 1. **Compilation vs Runtime Thinking**
```csharp
// C# - Errors caught at compile time
string name = "John";
int length = name.Length; // ✅ Compiler knows this is valid

// vs JS/Python - Runtime discovery
// name.length (JS) or len(name) (Python) - errors found when running
```
**Mental Shift**: Think "design-time safety" over "runtime flexibility"

### 2. **Value vs Reference Types** 🏗️
```csharp
// Value types (struct) - copied by value
int a = 5;
int b = a;     // b gets a COPY of 5
a = 10;        // b is still 5

// Reference types (class) - shared reference
var list1 = new List<int> {1, 2, 3};
var list2 = list1;  // list2 points to SAME object
list1.Add(4);       // list2 also sees [1,2,3,4]
```

#### **Memory Layout Mental Model**
```csharp
// Stack (fast, automatic cleanup)
int x = 42;           // 4 bytes on stack
Point p = new(1, 2);  // 8 bytes on stack (struct)

// Heap (slower allocation, garbage collected)
string s = "hello";   // Reference on stack → object on heap
User u = new("John"); // Reference on stack → object on heap
```

#### **JS/Python Comparison**
| C# | JavaScript | Python | Behavior |
|---|---|---|---|
| `int`, `bool` (struct) | `5`, `true` | `5`, `True` | Copy by value |
| `string`, `object` (class) | `{}`, `[]` | `{}`, `[]` | Copy by reference |
| `int?` (nullable) | `undefined` | `None` | Can be null |

#### **When to Use Which**
**Value Types (struct/record struct):**
- Small data (≤ 16 bytes rule of thumb)
- Immutable by design
- Want copy semantics (like Point, Money, Color)
- Performance critical (no GC pressure)

**Reference Types (class/record):**
- Complex objects with identity
- Need inheritance/polymorphism  
- Large data structures
- Need to share mutable state

#### **Common Pitfalls for JS/Python Devs**
```csharp
// ❌ Thinking structs work like objects
var points = new Point[2];
points[0].X = 5;  // Modifies the struct IN the array ✅
var p = points[0];
p.X = 10;         // Only modifies the COPY ⚠️

// ✅ Better: use readonly structs or classes
public readonly record struct Point(int X, int Y);
public record PointClass(int X, int Y);  // Immutable class
```

**JS/Python equivalent**: Like primitives vs objects, but C# makes it explicit
**Rule of thumb**: structs = independent copies, classes = shared references

### 3. **Explicit vs Implicit Typing**
```csharp
// Explicit (preferred for public APIs)
public string GetUserName(int userId) { }

// Implicit (good for local variables)
var user = GetUser(123);  // compiler infers User type
var names = new List<string>();  // compiler knows it's List<string>
```
**Mental Shift**: Use `var` locally, be explicit at boundaries
**vs TS**: Like `const user = getUser(123)` but compiler is smarter

### 4. **Immutability by Design**
```csharp
// Records - immutable by default (like const objects but actually immutable)
public record User(string Name, int Age);
var user1 = new User("John", 25);
var user2 = user1 with { Age = 26 };  // Creates new instance

// vs trying to modify
user1.Age = 26; // ❌ Compiler error - property is read-only
```
**vs JS**: Like `Object.freeze()` but enforced by the type system
**vs Python**: Like `@dataclass(frozen=True)` but more ergonomic

## 📚 Collection Mental Models

### 5. **LINQ = Functional Programming Made Easy**
```csharp
var users = GetUsers();

// Method chaining (like JS array methods)
var adults = users
    .Where(u => u.Age >= 18)        // .filter()
    .Select(u => u.Name)            // .map()
    .OrderBy(name => name)          // .sort()
    .ToList();                      // materialize

// Query syntax (like SQL)
var query = from u in users
            where u.Age >= 18
            select u.Name;
```
**Mental Shift**: Think "SQL for objects" not just "better loops"
**Performance**: Lazy evaluation like Python generators until you call `.ToList()`

### 6. **Collections Have Purpose**
```csharp
// Different collections for different needs
List<T>        // JS Array - ordered, indexed, mutable
IEnumerable<T> // Python iterator - forward-only, lazy
Dictionary<K,V> // JS Map/Object - key-value lookup
HashSet<T>     // JS Set - unique values, fast lookup
```
**Rule of thumb**: Use `List<T>` by default, `IEnumerable<T>` for parameters

## 🔄 Async/Await Mental Models

### 7. **Tasks are Promises with Structure**
```csharp
// C# Task = JS Promise, but more structured
public async Task<User> GetUserAsync(int id)
{
    var response = await httpClient.GetAsync($"/users/{id}");
    return await response.Content.ReadFromJsonAsync<User>();
}

// ConfigureAwait(false) = "don't capture context"
await SomeAsyncMethod().ConfigureAwait(false);
```
**vs JS**: No need for `.then()` chains, but be aware of synchronization context
**vs Python**: Like `async`/`await` but with explicit `Task<T>` return types

### 8. **Null Handling Philosophy**
```csharp
// Nullable Reference Types (C# 8+)
string? name = GetName();  // Might be null
string guaranteed = GetName() ?? "default";  // Never null

// Pattern matching for null checks
string result = name switch
{
    null => "No name",
    var n when n.Length > 10 => "Long name", 
    var n => $"Hello {n}"
};
```
**Mental Shift**: Make nullability explicit in your design
**vs TS**: Like strict mode but enforced by compiler

## 🏗️ Architecture Mental Models

### 9. **Dependency Injection is Built-In**
```csharp
// Registration (in Program.cs)
builder.Services.AddScoped<IUserService, UserService>();

// Consumption (constructor injection)
public class UserController(IUserService userService)
{
    public async Task<User> GetUser(int id) => await userService.GetAsync(id);
}
```
**vs JS**: No need for external DI libraries
**Mental Shift**: Design around interfaces, let framework manage lifetimes

### 10. **Error Handling Strategy**
```csharp
// Exceptions for truly exceptional cases
public User GetUser(int id)
{
    return id > 0 
        ? repository.GetUser(id) ?? throw new UserNotFoundException(id)
        : throw new ArgumentException("ID must be positive", nameof(id));
}

// Result pattern for expected failures
public Result<User> TryGetUser(int id)
{
    return id > 0 
        ? Result.Success(repository.GetUser(id))
        : Result.Failure("Invalid ID");
}
```
**vs JS**: Use exceptions sparingly, prefer explicit error types
**vs Python**: Similar to exceptions, but more conservative usage

## ⚡ Performance Mental Models

### 11. **Memory Management**
```csharp
// Stack vs Heap awareness
public struct Point(int X, int Y);  // Stack allocated - fast
public class Rectangle(Point topLeft, Point bottomRight);  // Heap allocated

// Span<T> for high-performance scenarios (like ArrayBuffer)
ReadOnlySpan<char> span = "Hello World".AsSpan(6);  // No allocation
```
**Mental Shift**: Be aware of allocations, but don't over-optimize early
**vs JS/Python**: You have more control but GC still handles cleanup

### 12. **String Handling**
```csharp
// Strings are immutable (like JS/Python)
string name = "John";
name += " Doe";  // Creates new string instance

// For multiple concatenations
var sb = new StringBuilder();
sb.Append("Hello").Append(" ").Append("World");
string result = sb.ToString();

// String interpolation (like template literals)
string message = $"Hello {name}, you are {age} years old";
```
**Rule of thumb**: Use `+` for few concatenations, `StringBuilder` for many

## 🎯 Common Migration Mistakes to Avoid

### 13. **Don't Fight the Type System**
```csharp
// ❌ Trying to be too dynamic (JS habits)
object data = GetData();
var result = (string)data;  // Runtime error if wrong type

// ✅ Embrace static typing
T ParseData<T>(string json) => JsonSerializer.Deserialize<T>(json);
var user = ParseData<User>(jsonString);  // Compile-time safety
```

### 14. **Don't Ignore Async Best Practices**
```csharp
// ❌ Blocking async code (will deadlock)
var result = SomeAsyncMethod().Result;

// ✅ Async all the way
var result = await SomeAsyncMethod();

// ✅ ConfigureAwait in libraries
await SomeAsyncMethod().ConfigureAwait(false);
```

## 🔧 Practical Rules of Thumb

1. **Use `var` for locals, explicit types for APIs**
2. **Prefer immutable types (records) over mutable classes**
3. **Use `IEnumerable<T>` for parameters, concrete types for returns**
4. **Async methods should end with `Async` and return `Task<T>`**
5. **Use nullable reference types (`string?`) to express intent**
6. **Constructor injection over service locator pattern**
7. **Use pattern matching instead of nested if/else**
8. **LINQ for data transformation, loops for performance-critical code**

## 📖 Next Steps
- Practice with these patterns in small examples
- Read about .NET memory model and GC
- Learn ASP.NET Core for web APIs
- Explore Entity Framework Core for data access
- Study dependency injection patterns
- Understand async/await internals

Remember: C# rewards explicit design decisions over runtime flexibility. Embrace the compile-time safety!