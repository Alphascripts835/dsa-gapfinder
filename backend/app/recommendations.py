def _r(concept, prereq, objective, problems, nxt):
    return {"concept": concept, "prerequisites": prereq, "objective": objective,
            "problems": [{"title": t, "difficulty": d, "why": w} for t, d, w in problems], "next_action": nxt}

RECS = {
 "Arrays": _r("Arrays store elements contiguously, giving O(1) indexing.", ["Loops","Big-O basics"],"Use two pointers and prefix sums confidently.",
   [("Two Sum II (sorted)","Beginner","Practice two pointers"),("Maximum Subarray","Intermediate","Learn Kadane's idea"),("Product of Array Except Self","Advanced","Prefix/suffix reasoning")],"Solve Two Sum II, then trace pointer moves by hand."),
 "Strings": _r("Strings are character sequences; frequency maps and windows solve most problems.", ["Arrays","Hash maps"],"Apply sliding window and frequency counting.",
   [("Valid Anagram","Beginner","Frequency counting"),("Longest Substring Without Repeating Characters","Intermediate","Sliding window"),("Minimum Window Substring","Advanced","Window with counts")],"Solve Valid Anagram, then try the sliding window problem."),
 "Linked Lists": _r("Linked lists connect nodes by pointers; most bugs are pointer-order mistakes.", ["Pointers/references"],"Manipulate pointers safely.",
   [("Reverse Linked List","Beginner","Core pointer rewiring"),("Linked List Cycle","Intermediate","Fast/slow pointers"),("Merge k Sorted Lists","Advanced","Pointer merging at scale")],"Draw node diagrams while reversing a list."),
 "Stacks and Queues": _r("Stacks are LIFO, queues are FIFO.", ["Arrays","Linked lists"],"Pick the right structure for a problem.",
   [("Valid Parentheses","Beginner","Stack matching"),("Daily Temperatures","Intermediate","Monotonic stack"),("Sliding Window Maximum","Advanced","Monotonic deque")],"Solve Valid Parentheses with a stack."),
 "Recursion": _r("Recursion solves a problem via smaller copies of itself, stopped by a base case.", ["Functions","Call stack"],"Identify base cases and trace recursive calls.",
   [("Factorial","Beginner","Simplest base case"),("Fibonacci (recursive + memoized)","Intermediate","See overlapping calls"),("Subsets","Advanced","Recursion on arrays")],"Review base cases, trace factorial(4), then solve Fibonacci."),
 "Binary Search": _r("Binary search halves a sorted range each step.", ["Sorted arrays","Loop invariants"],"Write bug-free boundary logic.",
   [("Binary Search","Beginner","Standard template"),("Search in Rotated Sorted Array","Intermediate","Modified condition"),("Koko Eating Bananas","Advanced","Search on answer")],"Implement the template and test edge cases."),
 "Trees": _r("Trees are hierarchical; most solutions are recursive traversals.", ["Recursion","Queues"],"Choose the right traversal.",
   [("Maximum Depth of Binary Tree","Beginner","Recursive DFS"),("Binary Tree Level Order Traversal","Intermediate","BFS with queue"),("Lowest Common Ancestor","Advanced","Recursive reasoning")],"Do the three traversals by hand on a small tree."),
 "Graphs": _r("Graphs model relationships; BFS/DFS explore them.", ["Trees","Queues","Recursion"],"Traverse and find paths.",
   [("Number of Islands","Beginner","Grid DFS/BFS"),("Course Schedule","Intermediate","Cycle detection"),("Network Delay Time","Advanced","Dijkstra")],"Implement BFS with an adjacency list."),
 "Sorting": _r("Sorting algorithms trade time, space and stability.", ["Recursion","Arrays"],"Compare sorts and apply them.",
   [("Sort Colors","Beginner","In-place partitioning"),("Merge Intervals","Intermediate","Sort then sweep"),("Kth Largest Element","Advanced","Quickselect/heap")],"Implement merge sort and note its complexity."),
 "Dynamic Programming": _r("DP caches subproblem answers to avoid recomputation.", ["Recursion","Memoization"],"Define states and transitions.",
   [("Climbing Stairs","Beginner","Simplest DP"),("House Robber","Intermediate","State transitions"),("0/1 Knapsack","Advanced","2D DP table")],"Solve Climbing Stairs recursively, then memoize."),
}
