"""DSA doubt-solving chatbot.
- If ANTHROPIC_API_KEY is set: answers come from a real AI model (source="ai").
- Otherwise (or if the API fails): a small local FAQ answers (source="local", rule-based, NOT AI).
"""
import os, re
from pathlib import Path
import httpx

def _load_env():
    f = Path(__file__).resolve().parents[1] / ".env"
    if f.exists():
        for line in f.read_text().splitlines():
            if "=" in line and not line.strip().startswith("#"):
                k, v = line.split("=", 1); os.environ.setdefault(k.strip(), v.strip())
_load_env()

SYSTEM = ("You are a friendly DSA (data structures & algorithms) tutor for students, including beginners and school-age learners. "
          "Answer only DSA, programming-concept and complexity questions; politely decline anything else. "
          "Explain simply with a small analogy or example, keep code short (Python), mention time/space complexity when relevant, "
          "and keep answers under about 250 words. If unsure, say so rather than guessing.")

KB = [
 (["array", "arrays"], "An array stores items in consecutive memory slots, so reading arr[i] is O(1). Inserting/deleting in the middle is O(n) because items shift. Common tricks: two pointers, prefix sums, sliding window."),
 (["string", "anagram", "palindrome", "substring"], "A string is a sequence of characters. Frequency maps (counting letters) solve anagram problems, and a sliding window solves 'longest substring' problems in O(n). In many languages strings are immutable, so repeated += is O(n^2)."),
 (["linked list", "linkedlist", "node", "pointer"], "A linked list is a chain of nodes, each holding a value and a pointer to the next node. Insert after a known node is O(1); finding an item is O(n). Use fast/slow pointers to find the middle or detect a cycle."),
 (["stack", "lifo", "parentheses"], "A stack is last-in-first-out, like a pile of plates: push adds on top, pop removes from top (both O(1)). It is used for undo, balanced brackets and DFS."),
 (["queue", "fifo", "deque"], "A queue is first-in-first-out, like a line at a shop: enqueue at the back, dequeue from the front (O(1)). It powers BFS and scheduling."),
 (["recursion", "recursive", "base case"], "Recursion means a function calls itself on a smaller version of the problem. Every recursion needs a base case to stop. Example:\n```python\ndef fact(n):\n    if n <= 1: return 1\n    return n * fact(n-1)\n```\nIt uses O(n) call-stack space here."),
 (["binary search"], "Binary search finds a value in a SORTED array by checking the middle and discarding half each step: O(log n).\n```python\nlo, hi = 0, len(a)-1\nwhile lo <= hi:\n    mid = lo + (hi-lo)//2\n    if a[mid] == x: return mid\n    if a[mid] < x: lo = mid+1\n    else: hi = mid-1\n```"),
 (["tree", "bst", "binary tree", "inorder", "traversal"], "A tree is nodes connected in a hierarchy (one root, children below). In a binary search tree, left < node < right, so inorder traversal gives sorted order. DFS traversals: preorder, inorder, postorder; BFS is level order using a queue."),
 (["graph", "bfs", "dfs", "dijkstra", "adjacency"], "A graph is vertices connected by edges. Store it as an adjacency list (O(V+E) space). BFS (queue) finds shortest paths in unweighted graphs; DFS (stack/recursion) explores deep. Dijkstra handles non-negative weights."),
 (["sort", "sorting", "merge sort", "quick sort", "bubble"], "Sorting orders data. Bubble/insertion sort are O(n^2); merge sort is O(n log n) always and stable; quick sort is O(n log n) on average but O(n^2) with bad pivots."),
 (["dynamic programming", "dp", "memoization", "knapsack"], "Dynamic programming solves a problem by storing answers to overlapping subproblems so each is computed once. Steps: define the state, write the transition, set base cases, then memoize (top-down) or fill a table (bottom-up). Example: fib with memo is O(n) instead of O(2^n)."),
 (["big o", "big-o", "complexity", "time complexity"], "Big-O describes how running time grows with input size n: O(1) constant, O(log n) halving, O(n) one pass, O(n log n) good sorting, O(n^2) nested loops, O(2^n) brute-force branching."),
 (["hash", "hashmap", "dictionary", "hash table"], "A hash map stores key-value pairs and uses a hash function to jump to a bucket, giving average O(1) lookup, insert and delete. Collisions are handled by chaining or probing."),
 (["heap", "priority queue"], "A heap is a tree-shaped structure where the parent is always smaller (min-heap) or larger (max-heap) than its children. Push/pop are O(log n), peeking the top is O(1). Used for 'k largest' problems and Dijkstra."),
]

def local_answer(msg: str) -> str:
    q = msg.lower(); best, score = None, 0
    for keys, ans in KB:
        s = sum(len(re.findall(r"\b" + re.escape(k) + r"\b", q)) for k in keys)
        if s > score: best, score = ans, s
    if best: return best
    return ("I couldn't find that in my built-in notes. Try asking about arrays, strings, linked lists, stacks, queues, recursion, "
            "binary search, trees, graphs, sorting, dynamic programming, hash maps, heaps or Big-O.")

def ask(message: str, history: list) -> dict:
    key = os.environ.get("ANTHROPIC_API_KEY")
    if key:
        msgs = [{"role": h["role"], "content": h["content"]} for h in history[-6:]] + [{"role": "user", "content": message}]
        try:
            r = httpx.post("https://api.anthropic.com/v1/messages", timeout=30,
                headers={"x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"},
                json={"model": os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-4-6"), "max_tokens": 600, "system": SYSTEM, "messages": msgs})
            r.raise_for_status()
            text = "".join(b.get("text", "") for b in r.json()["content"] if b.get("type") == "text")
            if text.strip(): return {"answer": text, "source": "ai"}
        except Exception:
            pass  # fall through to the local FAQ
    return {"answer": local_answer(message), "source": "local"}
