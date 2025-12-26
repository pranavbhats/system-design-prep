using System.Collections;



public class TypesDemo
{
    public static void RunAllDemos()
    {
        Console.WriteLine("=== C# VALUE vs REFERENCE TYPES DEMO ===\n");

        ClassVsStructVsRecordDemo();
        ValueTypeDemo();
        ReferenceTypeDemo();
        CollectionDemo();
        PerformanceDemo();
        NullableDemo();
        BoxingDemo();
    }
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
// COMPARISON TYPES FOR DEMO
// ========================================

// CLASS: Reference type, mutable, inheritance
public class PersonClass
{
    public string Name { get; set; }
    public int Age { get; set; }
    
    public PersonClass(string name, int age)
    {
        Name = name;
        Age = age;
    }
}

// STRUCT: Value type, typically immutable, no inheritance
public struct PersonStruct
{
    public string Name { get; set; }
    public int Age { get; set; }
    
    public PersonStruct(string name, int age)
    {
        Name = name;
        Age = age;
    }
}

// RECORD CLASS: Reference type, immutable by default, value equality
public record PersonRecord(string Name, int Age);

// RECORD STRUCT: Value type, immutable, value equality
public readonly record struct PersonRecordStruct(string Name, int Age);

    // ========================================
    // DEMO METHODS
    // ========================================

    public static void ClassVsStructVsRecordDemo()
    {
        Console.WriteLine("=== CLASS vs STRUCT vs RECORD COMPARISON ===\n");

        // ========================================
        // 1. MEMORY BEHAVIOR
        // ========================================
        Console.WriteLine("1. MEMORY BEHAVIOR:");
        Console.WriteLine("─────────────────────");
        
        // Class: Reference type (heap)
        PersonClass person1 = new("Alice", 25);
        PersonClass person2 = person1;          // Reference copy
        person2.Age = 30;
        Console.WriteLine($"Class - person1.Age: {person1.Age}"); // 30 (shared!)
        
        // Struct: Value type (stack)
        PersonStruct struct1 = new("Bob", 25);
        PersonStruct struct2 = struct1;        // Full copy
        struct2.Age = 30;
        Console.WriteLine($"Struct - struct1.Age: {struct1.Age}"); // 25 (independent!)
        
        // Record: Reference type but immutable
        PersonRecord record1 = new("Charlie", 25);
        PersonRecord record2 = record1 with { Age = 30 }; // Creates new instance
        Console.WriteLine($"Record - record1.Age: {record1.Age}"); // 25 (immutable!)
        Console.WriteLine($"Record - record2.Age: {record2.Age}"); // 30 (new instance!)

        // ========================================
        // 2. EQUALITY COMPARISON
        // ========================================
        Console.WriteLine("\n2. EQUALITY COMPARISON:");
        Console.WriteLine("─────────────────────────");
        
        // Class: Reference equality by default
        PersonClass class1 = new("David", 30);
        PersonClass class2 = new("David", 30);
        Console.WriteLine($"Class equality (same values): {class1.Equals(class2)}"); // False! Different objects
        Console.WriteLine($"Class reference equality: {ReferenceEquals(class1, class2)}"); // False
        
        // Struct: Value equality (compares all fields)
        PersonStruct structA = new("David", 30);
        PersonStruct structB = new("David", 30);
        Console.WriteLine($"Struct equality (same values): {structA.Equals(structB)}"); // True! Value equality
        
        // Record: Value equality by default
        PersonRecord recordA = new("David", 30);
        PersonRecord recordB = new("David", 30);
        Console.WriteLine($"Record equality (same values): {recordA.Equals(recordB)}"); // True! Value equality
        Console.WriteLine($"Record reference equality: {ReferenceEquals(recordA, recordB)}"); // False (different objects)

        // ========================================
        // 3. IMMUTABILITY & WITH EXPRESSIONS
        // ========================================
        Console.WriteLine("\n3. IMMUTABILITY & WITH EXPRESSIONS:");
        Console.WriteLine("──────────────────────────────────────");
        
        // Class: Mutable by default
        PersonClass mutableClass = new("Eve", 25);
        mutableClass.Age = 26; // ✅ Allowed
        Console.WriteLine($"Class after mutation: {mutableClass.Name}, {mutableClass.Age}");
        
        // Record: Immutable with 'with' expressions
        PersonRecord immutableRecord = new("Frank", 25);
        // immutableRecord.Age = 26; // ❌ Compiler error!
        PersonRecord updatedRecord = immutableRecord with { Age = 26 }; // ✅ Creates new instance
        Console.WriteLine($"Record original: {immutableRecord.Name}, {immutableRecord.Age}");
        Console.WriteLine($"Record updated: {updatedRecord.Name}, {updatedRecord.Age}");

        // ========================================
        // 4. NULL BEHAVIOR
        // ========================================
        Console.WriteLine("\n4. NULL BEHAVIOR:");
        Console.WriteLine("──────────────────");
        
        // Class: Can be null
        PersonClass? nullClass = null;
        Console.WriteLine($"Class can be null: {nullClass == null}");
        
        // Struct: Cannot be null (unless nullable)
        PersonStruct? nullableStruct = null; // ✅ Nullable struct
        Console.WriteLine($"Nullable struct: {nullableStruct == null}");
        
        // Record: Can be null (it's a reference type)
        PersonRecord? nullRecord = null;
        Console.WriteLine($"Record can be null: {nullRecord == null}");

        // ========================================
        // 5. JS/PYTHON MENTAL MODEL
        // ========================================
        Console.WriteLine("\n5. JS/PYTHON EQUIVALENT THINKING:");
        Console.WriteLine("────────────────────────────────────");
        Console.WriteLine("JavaScript/Python: Everything is an object");
        Console.WriteLine("let person = { name: 'Alice', age: 25 };");
        Console.WriteLine("let other = person;  // Reference (like C# class)");
        Console.WriteLine("other.age = 30;      // Mutates original");
        Console.WriteLine();
        Console.WriteLine("C# gives you explicit control:");
        Console.WriteLine("• class   = JS object (reference, mutable)");
        Console.WriteLine("• struct  = Copied value (independent, stack)");
        Console.WriteLine("• record  = Immutable object (value equality, with expressions)");
    }

    public static void ValueTypeDemo()
    {
        Console.WriteLine("=== VALUE TYPE BEHAVIOR ===");

        // Each variable gets its own copy
        Point p1 = new(1, 2);
        Point p2 = p1;           // FULL COPY (like JS primitives)

        // p2.X = 100;
        Console.WriteLine($"p1.X = {p1.X}"); // Still 1 ✓
        Console.WriteLine($"p2.X = {p2.X}"); // Now 100

        // They're the same object!
        Console.WriteLine($"Same object? {p1.Equals(p2)}"); // False

        // Stack allocation - no GC pressure
        Money price1 = new(99.99m, "USD");
        Money price2 = price1;   // Full copy again
        // 
        Console.WriteLine(price2.Equals(price1)); // True

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
        // PointClass? pc3 = null;
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

        // ========================================
        // WHAT IS BOXING?
        // ========================================
        Console.WriteLine("1. Basic Boxing Example:");
        
        // Boxing: value type → reference type (heap allocation)
        int value = 42;           // Stack: 4 bytes
        object boxed = value;     // Heap: 24+ bytes (boxing!)
        
        Console.WriteLine($"Original int: {value}");
        Console.WriteLine($"Boxed object: {boxed}");
        Console.WriteLine($"Same value? {value.Equals(boxed)}");
        // Console.WriteLine($"Same reference? {ReferenceEquals(value, boxed)}"); // False!

        // Unboxing: reference type → value type (cast required)
        int unboxed = (int)boxed; // Must cast to exact type
        Console.WriteLine($"Unboxed: {unboxed}");
        
        // ========================================
        // WHEN BOXING HAPPENS (PERFORMANCE TRAPS)
        // ========================================
        Console.WriteLine("\n2. Hidden Boxing Examples:");
        
        // ❌ OLD WAY: ArrayList boxes everything
        ArrayList oldList = [1, 2, 3, "hello"];    // Each int gets boxed!
        
        // ✅ MODERN WAY: Generics avoid boxing
        List<int> numbers = [1, 2, 3]; // No boxing!
        
        // ❌ String formatting can cause boxing
        Point p = new(10, 20);
        string bad = $"Point: {p}";  // Boxing! struct → object for ToString()
        
        // ✅ Better: explicit ToString or interpolation with proper types
        string good = $"Point: {p.X}, {p.Y}";  // No boxing
        
        // ========================================
        // PERFORMANCE IMPACT DEMO
        // ========================================
        Console.WriteLine("\n3. Performance Impact:");
        
        var start = DateTime.Now;
        
        // Boxing operation (slow)
        for (int i = 0; i < 100_000; i++)
        {
            object box = i;  // Boxing each iteration!
            int unbox = (int)box;  // Unboxing each iteration!
        }
        
        var boxingTime = DateTime.Now - start;
        
        // No boxing operation (fast)
        start = DateTime.Now;
        for (int i = 0; i < 100_000; i++)
        {
            int direct = i;  // Direct value type operations
            int copy = direct;
        }
        
        var directTime = DateTime.Now - start;
        
        Console.WriteLine($"Boxing/Unboxing: {boxingTime.TotalMilliseconds:F2}ms");
        Console.WriteLine($"Direct operations: {directTime.TotalMilliseconds:F2}ms");
        
        // ========================================
        // BOXING WITH INTERFACES
        // ========================================
        Console.WriteLine("\n4. Interface Boxing:");
        
        // IComparable<int> is implemented by int, but...
        IComparable comparable = 42;  // Boxing! int → object implementing interface
        
        // Better: Use generic interface when possible
        IComparable<int> genericComparable = 42;  // No boxing with generic interface!
        
        // ========================================
        // JS/PYTHON EQUIVALENT THINKING
        // ========================================
        Console.WriteLine("\n5. Mental Model for JS/Python Devs:");
        Console.WriteLine("// JavaScript - everything is an object");
        Console.WriteLine("// let num = 42;");
        Console.WriteLine("// let obj = num;  // No conversion needed");
        Console.WriteLine();
        Console.WriteLine("// C# - explicit memory model control");
        Console.WriteLine("// int num = 42;      // Stack (value)");
        Console.WriteLine("// object obj = num;  // Heap (reference) - BOXING!");
    }
}