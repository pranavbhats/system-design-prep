using System;
using System.Collections.Generic;
using System.Text;

// ========================================
// SPAN<T> AND READONLYSPAN<T> DEMO
// High-performance memory views for modern C#
// ========================================

public static class SpanDemo
{
    public static void RunAllDemos()
    {
        Console.WriteLine("=== SPAN<T> AND READONLYSPAN<T> DEMO ===\n");
        
        WhatIsSpanDemo();
        MemoryEfficiencyDemo();
        StringSlicingDemo();
        ArraySlicingDemo();
        PerformanceComparisonDemo();
        PracticalUseCasesDemo();
        JavaScriptPythonComparisonDemo();
    }

    // ========================================
    // 1. WHAT IS SPAN<T>?
    // ========================================
    public static void WhatIsSpanDemo()
    {
        Console.WriteLine("1. WHAT IS SPAN<T>?");
        Console.WriteLine("─────────────────────");
        Console.WriteLine("Span<T> = A view over memory (no copying!)");
        Console.WriteLine("ReadOnlySpan<T> = Immutable view over memory\n");

        // Traditional way: Creates copies
        int[] numbers = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        int[] subArray = new int[3];
        Array.Copy(numbers, 2, subArray, 0, 3); // Copies elements 2,3,4
        Console.WriteLine($"Traditional copy: [{string.Join(", ", subArray)}]");
        Console.WriteLine($"Memory allocated: {subArray.Length * sizeof(int)} bytes\n");

        // Modern way: No copying, just a view
        Span<int> span = numbers.AsSpan(2, 3); // Views elements 2,3,4
        Console.WriteLine($"Span view: [{string.Join(", ", span.ToArray())}]");
        Console.WriteLine("Memory allocated: 0 bytes (just a view!)\n");

        // Modify through span
        span[0] = 999;  // Modifies original array!
        Console.WriteLine($"After span modification: [{string.Join(", ", numbers)}]");
        Console.WriteLine("Notice: Element at index 2 changed from 3 to 999\n");
    }

    // ========================================
    // 2. MEMORY EFFICIENCY
    // ========================================
    public static void MemoryEfficiencyDemo()
    {
        Console.WriteLine("2. MEMORY EFFICIENCY:");
        Console.WriteLine("──────────────────────");

        string text = "Hello, World! This is a long string for demonstration.";
        
        // ❌ OLD WAY: Substring creates new string
        string oldSubstring = text.Substring(7, 5); // "World"
        Console.WriteLine($"Substring result: '{oldSubstring}'");
        Console.WriteLine("Memory: Creates new string object (expensive!)\n");
        
        // ✅ NEW WAY: ReadOnlySpan creates view
        ReadOnlySpan<char> spanView = text.AsSpan(7, 5); // "World"
        Console.WriteLine($"Span view result: '{spanView.ToString()}'");
        Console.WriteLine("Memory: No allocation, just points to original string!\n");

        // Demonstrate with larger data
        char[] largeArray = new char[1_000_000];
        for (int i = 0; i < largeArray.Length; i++)
            largeArray[i] = (char)('A' + (i % 26));

        var start = DateTime.Now;
        
        // Expensive: Create 1000 substrings
        for (int i = 0; i < 1000; i++)
        {
            string sub = new string(largeArray, i, 100); // Allocation!
        }
        var substringTime = DateTime.Now - start;
        
        // Cheap: Create 1000 spans
        start = DateTime.Now;
        for (int i = 0; i < 1000; i++)
        {
            ReadOnlySpan<char> span = largeArray.AsSpan(i, 100); // No allocation!
        }
        var spanTime = DateTime.Now - start;
        
        Console.WriteLine($"1000 substrings: {substringTime.TotalMilliseconds:F2}ms (with allocations)");
        Console.WriteLine($"1000 spans: {spanTime.TotalMilliseconds:F2}ms (zero allocations)\n");
    }

    // ========================================
    // 3. STRING SLICING (LIKE PYTHON!)
    // ========================================
    public static void StringSlicingDemo()
    {
        Console.WriteLine("3. STRING SLICING (LIKE PYTHON!):");
        Console.WriteLine("───────────────────────────────────");
        
        string text = "Programming";
        
        // Python-like slicing with Span
        ReadOnlySpan<char> fullSpan = text.AsSpan();
        ReadOnlySpan<char> start = text.AsSpan(0, 4);      // "Prog"
        ReadOnlySpan<char> middle = text.AsSpan(4, 4);     // "ramm"
        ReadOnlySpan<char> end = text.AsSpan(7);           // "ming"
        ReadOnlySpan<char> last3 = text.AsSpan(^3);        // "ing" (using Index)
        ReadOnlySpan<char> range = text.AsSpan(2..6);      // "ogra" (using Range)
        
        Console.WriteLine($"Original: '{text}'");
        Console.WriteLine($"Start(0,4): '{start.ToString()}'");
        Console.WriteLine($"Middle(4,4): '{middle.ToString()}'");
        Console.WriteLine($"End(7..): '{end.ToString()}'");
        Console.WriteLine($"Last 3(^3): '{last3.ToString()}'");
        Console.WriteLine($"Range(2..6): '{range.ToString()}'");
        
        Console.WriteLine("\nPython equivalent:");
        Console.WriteLine("text = 'Programming'");
        Console.WriteLine("text[0:4]   # 'Prog'");
        Console.WriteLine("text[4:8]   # 'ramm'");
        Console.WriteLine("text[7:]    # 'ming'");
        Console.WriteLine("text[-3:]   # 'ing'");
        Console.WriteLine("text[2:6]   # 'ogra'\n");
    }

    // ========================================
    // 4. ARRAY SLICING AND MANIPULATION
    // ========================================
    public static void ArraySlicingDemo()
    {
        Console.WriteLine("4. ARRAY SLICING AND MANIPULATION:");
        Console.WriteLine("────────────────────────────────────");
        
        int[] data = { 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 };
        
        // Create different views of the same array
        Span<int> fullView = data.AsSpan();
        Span<int> firstHalf = data.AsSpan(0, 5);
        Span<int> secondHalf = data.AsSpan(5);
        ReadOnlySpan<int> middleView = data.AsSpan(2, 4);
        
        Console.WriteLine($"Original array: [{string.Join(", ", data)}]");
        Console.WriteLine($"First half: [{string.Join(", ", firstHalf.ToArray())}]");
        Console.WriteLine($"Second half: [{string.Join(", ", secondHalf.ToArray())}]");
        Console.WriteLine($"Middle view: [{string.Join(", ", middleView.ToArray())}]");
        
        // Modify through different spans
        firstHalf[0] = 999;      // Changes data[0]
        secondHalf[0] = 888;     // Changes data[5]
        
        Console.WriteLine($"\nAfter modifications: [{string.Join(", ", data)}]");
        Console.WriteLine("All views reference the same underlying array!\n");
        
        // Span utility methods
        fullView.Fill(0);  // Fill entire array with 0
        Console.WriteLine($"After Fill(0): [{string.Join(", ", data)}]");
        
        // Restore and demonstrate other methods
        for (int i = 0; i < data.Length; i++) data[i] = (i + 1) * 10;
        
        Span<int> slice = data.AsSpan(2, 6);
        slice.Reverse();  // Reverse just the slice
        Console.WriteLine($"After reversing middle 6 elements: [{string.Join(", ", data)}]");
        
        slice.Sort();     // Sort just the slice
        Console.WriteLine($"After sorting the slice: [{string.Join(", ", data)}]\n");
    }

    // ========================================
    // 5. PERFORMANCE COMPARISON
    // ========================================
    public static void PerformanceComparisonDemo()
    {
        Console.WriteLine("5. PERFORMANCE COMPARISON:");
        Console.WriteLine("────────────────────────────");
        
        byte[] largeData = new byte[10_000];
        new Random().NextBytes(largeData);
        
        int iterations = 10_000;
        var start = DateTime.Now;
        
        // Method 1: Traditional array copying
        for (int i = 0; i < iterations; i++)
        {
            byte[] chunk = new byte[100];
            Array.Copy(largeData, i % 1000, chunk, 0, 100);
            ProcessBytesOld(chunk);
        }
        var copyTime = DateTime.Now - start;
        
        // Method 2: Using Span (zero-copy)
        start = DateTime.Now;
        for (int i = 0; i < iterations; i++)
        {
            ReadOnlySpan<byte> chunk = largeData.AsSpan(i % 1000, 100);
            ProcessBytesSpan(chunk);
        }
        var spanTime = DateTime.Now - start;
        
        Console.WriteLine($"Array copying: {copyTime.TotalMilliseconds:F2}ms");
        Console.WriteLine($"Span views: {spanTime.TotalMilliseconds:F2}ms");
        Console.WriteLine($"Speedup: {(double)copyTime.Ticks / spanTime.Ticks:F1}x faster\n");
        
        // Memory allocation demo
        long beforeMemory = GC.GetTotalMemory(true);
        
        // Allocate many arrays
        for (int i = 0; i < 1000; i++)
        {
            byte[] temp = new byte[1000];
        }
        long afterArrays = GC.GetTotalMemory(false);
        
        // Create many spans (no allocation)
        for (int i = 0; i < 1000; i++)
        {
            Span<byte> temp = largeData.AsSpan(0, 1000);
        }
        long afterSpans = GC.GetTotalMemory(false);
        
        Console.WriteLine($"Memory after 1000 arrays: {afterArrays - beforeMemory:N0} bytes");
        Console.WriteLine($"Memory after 1000 spans: {afterSpans - afterArrays:N0} bytes");
    }
    
    // Helper methods for performance demo
    private static void ProcessBytesOld(byte[] data)
    {
        // Simulate some processing
        byte sum = 0;
        for (int i = 0; i < data.Length; i++)
            sum += data[i];
    }
    
    private static void ProcessBytesSpan(ReadOnlySpan<byte> data)
    {
        // Simulate same processing with span
        byte sum = 0;
        for (int i = 0; i < data.Length; i++)
            sum += data[i];
    }

    // ========================================
    // 6. PRACTICAL USE CASES
    // ========================================
    public static void PracticalUseCasesDemo()
    {
        Console.WriteLine("6. PRACTICAL USE CASES:");
        Console.WriteLine("─────────────────────────");
        
        // Use Case 1: Parsing without allocation
        Console.WriteLine("Use Case 1: Efficient CSV parsing");
        string csvLine = "John,Doe,30,Engineer,50000";
        
        // Traditional way: Split creates array of strings
        string[] oldWay = csvLine.Split(',');
        Console.WriteLine($"Traditional split: {oldWay.Length} allocations");
        
        // Span way: Parse without creating intermediate strings
        ReadOnlySpan<char> line = csvLine.AsSpan();
        int fieldCount = 0;
        
        Console.WriteLine($"Span parsing: Processing fields one by one (zero allocations)");
        
        int start = 0;
        for (int i = 0; i <= line.Length; i++)
        {
            if (i == line.Length || line[i] == ',')
            {
                ReadOnlySpan<char> field = line.Slice(start, i - start);
                Console.WriteLine($"  Field {fieldCount}: '{field.ToString()}'");
                fieldCount++;
                start = i + 1;
            }
        }
        
        Console.WriteLine($"Fields processed: {fieldCount} (no intermediate strings created)");
        Console.WriteLine();
        
        // Use Case 2: Buffer management
        Console.WriteLine("Use Case 2: Efficient buffer operations");
        byte[] buffer = new byte[1024];
        
        // Fill different parts of buffer with different patterns
        buffer.AsSpan(0, 256).Fill(0xAA);      // First quarter
        buffer.AsSpan(256, 256).Fill(0xBB);    // Second quarter
        buffer.AsSpan(512, 256).Fill(0xCC);    // Third quarter
        buffer.AsSpan(768, 256).Fill(0xDD);    // Fourth quarter
        
        Console.WriteLine($"Buffer filled with patterns in {buffer.Length} bytes");
        Console.WriteLine($"First 8 bytes: {Convert.ToHexString(buffer.AsSpan(0, 8))}");
        Console.WriteLine($"Middle 8 bytes: {Convert.ToHexString(buffer.AsSpan(508, 8))}");
        Console.WriteLine($"Last 8 bytes: {Convert.ToHexString(buffer.AsSpan(1016, 8))}\n");
    }

    // ========================================
    // 7. JAVASCRIPT/PYTHON COMPARISON
    // ========================================
    public static void JavaScriptPythonComparisonDemo()
    {
        Console.WriteLine("7. JAVASCRIPT/PYTHON COMPARISON:");
        Console.WriteLine("──────────────────────────────────");
        
        Console.WriteLine("JAVASCRIPT:");
        Console.WriteLine("─────────────");
        Console.WriteLine("// JavaScript arrays are always references");
        Console.WriteLine("const arr = [1, 2, 3, 4, 5];");
        Console.WriteLine("const slice = arr.slice(1, 4);  // Creates NEW array [2, 3, 4]");
        Console.WriteLine("slice[0] = 999;                 // Original arr unchanged");
        Console.WriteLine("console.log(arr);               // [1, 2, 3, 4, 5]");
        Console.WriteLine();
        Console.WriteLine("// Typed arrays give more control but still limited");
        Console.WriteLine("const buffer = new ArrayBuffer(16);");
        Console.WriteLine("const view = new Int32Array(buffer, 4, 2); // View of buffer");
        Console.WriteLine();
        
        Console.WriteLine("PYTHON:");
        Console.WriteLine("─────────");
        Console.WriteLine("# Python slices usually create copies");
        Console.WriteLine("arr = [1, 2, 3, 4, 5]");
        Console.WriteLine("slice = arr[1:4]        # Creates NEW list [2, 3, 4]");
        Console.WriteLine("slice[0] = 999          # Original arr unchanged");
        Console.WriteLine("print(arr)              # [1, 2, 3, 4, 5]");
        Console.WriteLine();
        Console.WriteLine("# NumPy arrays support views (similar to C# Span)");
        Console.WriteLine("import numpy as np");
        Console.WriteLine("arr = np.array([1, 2, 3, 4, 5])");
        Console.WriteLine("view = arr[1:4]         # Creates VIEW (like C# Span!)");
        Console.WriteLine("view[0] = 999           # Original arr IS modified");
        Console.WriteLine("print(arr)              # [1, 999, 3, 4, 5]");
        Console.WriteLine();
        
        Console.WriteLine("C# SPAN:");
        Console.WriteLine("─────────");
        Console.WriteLine("// C# gives you explicit control over copying vs viewing");
        Console.WriteLine("int[] arr = {1, 2, 3, 4, 5};");
        Console.WriteLine("Span<int> span = arr.AsSpan(1, 3);  // VIEW (like NumPy)");
        Console.WriteLine("span[0] = 999;                      // Original modified!");
        Console.WriteLine("// arr is now {1, 999, 3, 4, 5}");
        Console.WriteLine();
        Console.WriteLine("// ReadOnlySpan prevents modification");
        Console.WriteLine("ReadOnlySpan<int> readOnly = arr.AsSpan(1, 3);");
        Console.WriteLine("// readOnly[0] = 999;  // Compiler error!");
        Console.WriteLine();
        
        Console.WriteLine("KEY INSIGHT:");
        Console.WriteLine("═════════════");
        Console.WriteLine("• JavaScript: Always copies (except typed arrays)");
        Console.WriteLine("• Python: Usually copies (except NumPy views)");
        Console.WriteLine("• C# Span: Explicit zero-copy views with compiler safety");
        Console.WriteLine("• C# gives you the performance of C with memory safety!");
    }
}