TOPICS = ["Arrays","Strings","Linked Lists","Stacks and Queues","Recursion",
          "Binary Search","Trees","Graphs","Sorting","Dynamic Programming"]

def _q(i, t, d, q, o, a, e):
    return {"id": i, "topic": t, "difficulty": d, "question": q, "options": o, "answer": a, "explanation": e}

QUESTIONS = [
 _q("arr1","Arrays","Easy","Time complexity of accessing arr[i] in an array?",["O(1)","O(n)","O(log n)","O(n^2)"],0,"Arrays use contiguous memory, so indexing is constant time."),
 _q("arr2","Arrays","Medium","Cost of inserting an element at the start of a dynamic array of n elements?",["O(1)","O(log n)","O(n)","O(n log n)"],2,"All n elements must shift right."),
 _q("arr3","Arrays","Medium","Which technique finds a pair summing to a target in a SORTED array in O(n)?",["Two pointers","Recursion","Binary tree","Nested loops"],0,"Move left/right pointers inward based on the current sum."),
 _q("str1","Strings","Easy","Two strings are anagrams if they have:",["Same length only","Same character counts","Same first letter","Same sorted indices"],1,"Anagrams contain identical characters with identical frequencies."),
 _q("str2","Strings","Medium","Why is repeated s += c in a loop O(n^2) with immutable strings?",["Each concatenation copies the string","Loops are slow","Hashing is needed","Strings live on disk"],0,"Each concatenation creates a new string, copying earlier characters."),
 _q("str3","Strings","Medium","Which approach solves longest substring without repeating characters in O(n)?",["Sliding window with a set/map","Stack","Heap","Segment tree"],0,"Expand the window right, shrink from the left on duplicates."),
 _q("ll1","Linked Lists","Easy","Time to insert after a known node in a singly linked list?",["O(1)","O(n)","O(log n)","O(n^2)"],0,"Only pointer updates are needed."),
 _q("ll2","Linked Lists","Medium","How can you detect a cycle in a linked list with O(1) extra space?",["Floyd's slow/fast pointers","Sort the list","Use recursion depth","Count nodes only"],0,"If a cycle exists, the fast pointer eventually meets the slow one."),
 _q("ll3","Linked Lists","Medium","To reverse a singly linked list iteratively you track:",["prev, curr, next","Only head","Only tail","A stack is mandatory"],0,"Re-point curr.next to prev after saving next."),
 _q("sq1","Stacks and Queues","Easy","Which order does a stack follow?",["FIFO","LIFO","Random","Sorted"],1,"Last in, first out."),
 _q("sq2","Stacks and Queues","Medium","Best structure for checking balanced parentheses?",["Stack","Queue","Heap","Trie"],0,"Push openers; pop and match on closers."),
 _q("sq3","Stacks and Queues","Medium","BFS on a graph uses which structure?",["Stack","Queue","Heap","Sorted array"],1,"A queue visits nodes level by level."),
 _q("rec1","Recursion","Easy","What prevents infinite recursion?",["A base case","A loop","A global variable","Memoization only"],0,"The base case stops further recursive calls."),
 _q("rec2","Recursion","Medium","Time complexity of naive recursive fib(n) = fib(n-1) + fib(n-2)?",["O(n)","O(log n)","O(2^n)","O(n^2)"],2,"Each call branches into two, growing exponentially."),
 _q("rec3","Recursion","Medium","Call-stack space used by recursive factorial(n)?",["O(1)","O(n)","O(log n)","O(n^2)"],1,"There are n nested calls on the stack."),
 _q("bs1","Binary Search","Easy","Binary search requires the array to be:",["Sorted","Unique","Of even length","Integers only"],0,"Halving works only if order lets us discard half."),
 _q("bs2","Binary Search","Medium","Time complexity of binary search?",["O(n)","O(log n)","O(1)","O(n log n)"],1,"The search space halves each step."),
 _q("bs3","Binary Search","Hard","To avoid overflow computing the midpoint of lo and hi, use:",["(lo+hi)/2 always","lo + (hi-lo)/2","hi - lo","lo * hi / 2"],1,"lo + (hi-lo)/2 avoids exceeding integer limits."),
 _q("tr1","Trees","Easy","Inorder traversal of a BST yields keys in:",["Sorted order","Reverse order","Level order","Random order"],0,"Left, node, right visits BST keys ascending."),
 _q("tr2","Trees","Medium","Max nodes in a binary tree of height h (root at height 0)?",["2^h","2^(h+1) - 1","h^2","2h"],1,"Sum of 2^0..2^h = 2^(h+1) - 1."),
 _q("tr3","Trees","Medium","Which traversal uses a queue?",["Inorder","Preorder","Level order","Postorder"],2,"Level order is BFS on the tree."),
 _q("gr1","Graphs","Easy","Adjacency list space for V vertices and E edges?",["O(V^2)","O(V+E)","O(E^2)","O(V log E)"],1,"One list per vertex plus entries for edges."),
 _q("gr2","Graphs","Medium","Which algorithm finds shortest paths in an unweighted graph?",["DFS","BFS","Kruskal","Prim"],1,"BFS reaches nodes in increasing edge-count order."),
 _q("gr3","Graphs","Hard","Dijkstra's algorithm fails with:",["Cycles","Negative edge weights","Directed edges","Sparse graphs"],1,"Greedy finalization assumes non-negative weights."),
 _q("so1","Sorting","Easy","Which sort has O(n log n) worst case?",["Quick sort","Merge sort","Bubble sort","Insertion sort"],1,"Merge sort always splits and merges in n log n."),
 _q("so2","Sorting","Medium","A stable sort preserves:",["Memory usage","Relative order of equal keys","Sortedness of input","Recursion depth"],1,"Equal elements keep their original order."),
 _q("so3","Sorting","Medium","Worst-case time of quick sort with a poor pivot?",["O(n log n)","O(n)","O(n^2)","O(log n)"],2,"Unbalanced partitions degrade to quadratic."),
 _q("dp1","Dynamic Programming","Easy","DP applies when a problem has:",["Overlapping subproblems and optimal substructure","Only sorted input","A graph","No recursion"],0,"Reusing solved subproblems is the core of DP."),
 _q("dp2","Dynamic Programming","Medium","Distinct subproblems in memoized fib(n)?",["n+1","2^n","n^2","log n"],0,"Each value fib(0..n) is computed once."),
 _q("dp3","Dynamic Programming","Hard","Time complexity of 0/1 knapsack DP with n items and capacity W?",["O(n+W)","O(nW)","O(2^n)","O(W log n)"],1,"The table has n x W states with O(1) transitions."),
]
BY_ID = {q["id"]: q for q in QUESTIONS}

def public_questions():
    return [{k: v for k, v in q.items() if k not in ("answer", "explanation")} for q in QUESTIONS]
