using System;

// Clear terminal at startup
Console.Clear();

Console.WriteLine("🎯 Welcome to C# Learning Hub!");
Console.WriteLine("Your journey from JS/TS/Python to C# mastery starts here!\n");

while (true)
{
    ShowMainMenu();
    string choice = Console.ReadLine()?.Trim() ?? "";
    
    // Clear terminal before showing content
    Console.Clear();
    
    switch (choice.ToLower())
    {
        case "1" or "types":
            RunTypesDemo();
            break;
        case "2" or "span":
            RunSpanDemo();
            break;
        case "3" or "all":
            RunAllDemos();
            break;
        case "q" or "quit" or "exit":
            Console.Clear();
            Console.WriteLine("👋 Happy coding! Keep practicing those C# skills!");
            return;
        default:
            Console.WriteLine("❌ Invalid choice. Please try again.\n");
            continue;
    }
    
    WaitForUserInput();
}

static void ShowMainMenu()
{
    Console.WriteLine(new string('=', 60));
    Console.WriteLine("📚 CHOOSE YOUR LEARNING TOPIC:");
    Console.WriteLine(new string('=', 60));
    Console.WriteLine("1️⃣  Value vs Reference Types (classes, structs, records)");
    Console.WriteLine("2️⃣  Span<T> & Memory Management (zero-copy views)");
    Console.WriteLine("3️⃣  Run ALL Available Demos");
    Console.WriteLine("q️⃣   Quit");
    Console.WriteLine(new string('=', 60));
    Console.Write("Enter your choice (1-3 or q): ");
}

static void RunTypesDemo()
{
    Console.WriteLine("🏗️  C# TYPE SYSTEM DEEP DIVE");
    Console.WriteLine("Comparing with JavaScript/TypeScript/Python...\n");
    TypesDemo.RunAllDemos();
}

static void RunSpanDemo()
{
    Console.WriteLine("⚡ HIGH-PERFORMANCE MEMORY VIEWS");
    Console.WriteLine("Zero-copy operations that JS/Python developers dream of!\n");
    SpanDemo.RunAllDemos();
}

static void RunAllDemos()
{
    Console.WriteLine("🚀 RUNNING ALL DEMOS - FULL C# EXPERIENCE!\n");
    
    RunTypesDemo();
    Console.WriteLine("\n" + new string('=', 60) + "\n");
    Console.WriteLine("Press any key to continue to next demo...");
    Console.ReadKey();
    Console.Clear();
    
    RunSpanDemo();
    Console.WriteLine("\n" + new string('=', 60) + "\n");
    
    Console.WriteLine("✅ All available demos completed!");
}

static void WaitForUserInput()
{
    Console.WriteLine("\n" + new string('-', 60));
    Console.WriteLine("Press any key to return to main menu...");
    Console.ReadKey();
    Console.Clear();
}

