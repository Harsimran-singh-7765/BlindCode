export interface Challenge {
    id: number;
    title: string;
    description: string;
    expectedOutput: string;
    timeLimit: number;
    difficulty: "easy" | "medium" | "hard" | "insane";
    starterCode: Record<string, string>;
}

export const CHALLENGES: Challenge[] = [
    {
        id: 1,
        title: "Hello World",
        description: "Print 'Hello, World!' to the console",
        expectedOutput: "Hello, World!",
        timeLimit: 120,
        difficulty: "easy",
        starterCode: {
            cpp: `#include <iostream>
using namespace std;

int main() {
    // Print Hello, World!
    
    return 0;
}`,
            python: `# Print Hello, World!
`,
            javascript: `// Print Hello, World!
`,
        },
    },
    {
        id: 2,
        title: "Sum of Two",
        description: "Print the sum of 10 and 20 (should output: 30)",
        expectedOutput: "30",
        timeLimit: 180,
        difficulty: "easy",
        starterCode: {
            cpp: `#include <iostream>
using namespace std;

int main() {
    int a = 10;
    int b = 20;
    // Print the sum of a and b
    
    return 0;
}`,
            python: `a = 10
b = 20
# Print the sum of a and b
`,
            javascript: `const a = 10;
const b = 20;
// Print the sum of a and b
`,
        },
    },
    {
        id: 3,
        title: "Countdown",
        description: "Print numbers from 5 to 1 (each on new line)",
        expectedOutput: "5\n4\n3\n2\n1",
        timeLimit: 240,
        difficulty: "medium",
        starterCode: {
            cpp: `#include <iostream>
using namespace std;

int main() {
    // Print 5 to 1, each on a new line
    
    return 0;
}`,
            python: `# Print 5 to 1, each on a new line
`,
            javascript: `// Print 5 to 1, each on a new line
`,
        },
    },
    {
        id: 4,
        title: "Factorial",
        description: "Print the factorial of 5 (should output: 120)",
        expectedOutput: "120",
        timeLimit: 300,
        difficulty: "medium",
        starterCode: {
            cpp: `#include <iostream>
using namespace std;

int main() {
    int n = 5;
    // Calculate and print factorial of n
    
    return 0;
}`,
            python: `n = 5
# Calculate and print factorial of n
`,
            javascript: `const n = 5;
// Calculate and print factorial of n
`,
        },
    },
    {
        id: 5,
        title: "FizzBuzz Single",
        description: "For n=15, print 'FizzBuzz' (divisible by both 3 and 5)",
        expectedOutput: "FizzBuzz",
        timeLimit: 300,
        difficulty: "hard",
        starterCode: {
            cpp: `#include <iostream>
using namespace std;

int main() {
    int n = 15;
    // If n is divisible by 3 and 5, print "FizzBuzz"
    // If only by 3, print "Fizz"
    // If only by 5, print "Buzz"
    // Else print the number
    
    return 0;
}`,
            python: `n = 15
# If n is divisible by 3 and 5, print "FizzBuzz"
# If only by 3, print "Fizz"
# If only by 5, print "Buzz"
# Else print the number
`,
            javascript: `const n = 15;
// If n is divisible by 3 and 5, print "FizzBuzz"
// If only by 3, print "Fizz"
// If only by 5, print "Buzz"
// Else print the number
`,
        },
    },
];
