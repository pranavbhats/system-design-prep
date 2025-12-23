public class TypesDemo
{
    // ========================================
    // VALUE TYPES (Stack allocation)
    // ========================================

    // Custom value type (struct)
    public struct Point
    {
        public int X;
        public int Y;
        
        public Point(int x, int y)
        {
            X = x;
            Y = y;
        }
    }

    // Record struct (C# 10+) - immutable value type
    public readonly record struct Money(decimal Amount, string Currency);

// ========================================
// REFERENCE TYPES (Heap allocation)
// ========================================

// Custom reference type (class)
class PointClass
{
    public int X { get; set; }
    public int Y { get; set; }

    public PointClass(int x, int y)
    {
        X = x;
        Y = y;
    }
}

// Record class (C# 9+) - immutable reference type
public record Person(string Name, int Age);

    // ========================================
    // DEMO METHODS
    // ========================================

    public static void ValueTypeDemo()
{
    Console.WriteLine("=== VALUE TYPE BEHAVIOR ===");

    // Each variable gets its own copy
    Point p1 = new(1, 2);
    Point p2 = p1;           // FULL COPY (like JS primitives)

    p2.X = 100;
    Console.WriteLine($"p1.X = {p1.X}"); // Still 1 ✓
    Console.WriteLine($"p2.X = {p2.X}"); // Now 100

    // Stack allocation - no GC pressure
    Money price1 = new(99.99m, "USD");
    Money price2 = price1;   // Full copy again
    // price2.Amount = 50;   // Won't compile - readonly!
}

public static void ReferenceTypeDemo()
{
    Console.WriteLine("\n=== REFERENCE TYPE BEHAVIOR ===");

    // Variables hold references to heap objects
    PointClass pc1 = new(1, 2);
    PointClass pc2 = pc1;    // Copy reference (like JS objects)

    pc2.X = 100;
    Console.WriteLine($"pc1.X = {pc1.X}"); // Now 100 ⚠️
    Console.WriteLine($"pc2.X = {pc2.X}"); // Also 100

    // They're the same object!
    Console.WriteLine($"Same object? {ReferenceEquals(pc1, pc2)}"); // True

    // Null is possible
    PointClass? pc3 = null;
    // Console.WriteLine(pc3.X); // NullReferenceException!
}

public static void CollectionDemo()
{
    Console.WriteLine("\n=== COLLECTION BEHAVIOR ===");

    // Arrays are reference types
    int[] array1 = { 1, 2, 3 };
    int[] array2 = array1;   // Reference copy
    array2[0] = 999;
    Console.WriteLine($"array1[0] = {array1[0]}"); // 999 (shared!)

    // But the elements are value types
    Point[] points1 = { new(1, 2), new(3, 4) };
    Point[] points2 = points1; // Reference to same array
    points2[0].X = 999;        // Modifies the struct in the array
    Console.WriteLine($"points1[0].X = {points1[0].X}"); // 999
}

public static void PerformanceDemo()
{
    Console.WriteLine("\n=== PERFORMANCE IMPLICATIONS ===");

    // Value types: stack allocation, no GC
    var start = DateTime.Now;
    for (int i = 0; i < 1_000_000; i++)
    {
        Point p = new(i, i);  // Super fast
    }
    Console.WriteLine($"Value type creation: {DateTime.Now - start}");

    // Reference types: heap allocation, GC pressure
    start = DateTime.Now;
    for (int i = 0; i < 1_000_000; i++)
    {
        PointClass pc = new(i, i);  // Slower + GC
    }
    Console.WriteLine($"Reference type creation: {DateTime.Now - start}");
}

// ========================================
// COMPARISON WITH JS/PYTHON
// ========================================

/*
JavaScript Equivalent:
let a = 5;              // Like C# int (value behavior)
let b = a;
a = 10;                 // b is still 5

let obj1 = {x: 1};      // Like C# class (reference behavior)
let obj2 = obj1;
obj1.x = 100;           // obj2.x is also 100

Python Equivalent:
a = 5                   # Immutable (value-like)
b = a
a = 10                  # b is still 5

obj1 = {'x': 1}        # Mutable (reference-like)
obj2 = obj1
obj1['x'] = 100        # obj2['x'] is also 100
*/

// ========================================
// NULLABLE TYPES (C# 8+)
// ========================================

public static void NullableDemo()
{
    Console.WriteLine("\n=== NULLABLE TYPES ===");

    // Value types cannot be null by default
    // int x = null;        // Won't compile

    // But nullable value types can
    int? nullableInt = null;
    if (nullableInt.HasValue)
    {
        Console.WriteLine($"Value: {nullableInt.Value}");
    }

    // Reference types can always be null (unless nullable reference types enabled)
    string? nullableString = null;
    Console.WriteLine($"String length: {nullableString?.Length ?? 0}");
}

// ========================================
// BOXING/UNBOXING (Advanced)
// ========================================

    public static void BoxingDemo()
    {
        Console.WriteLine("\n=== BOXING/UNBOXING ===");

        // Boxing: value type → reference type (heap allocation)
        int value = 42;
        object boxed = value;    // Boxing occurs (expensive!)

        // Unboxing: reference type → value type
        int unboxed = (int)boxed; // Unboxing (type cast required)

        // Avoid boxing with generics
        List<int> numbers = new() { 1, 2, 3 }; // No boxing ✓
        // ArrayList list = new() { 1, 2, 3 };    // Boxing occurs ⚠️
    }
}