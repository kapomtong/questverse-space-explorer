```javascript
const QVL = {
  0: [
    { q: "How do you greet someone in the morning?", choices: ["Good night","Good morning","Good afternoon","Goodbye"], answerIdx: 1, hint: "morning time" },
    { q: "What do you say when you meet someone for the first time?", choices: ["See you later","Nice to meet you","How are you?","Thank you"], answerIdx: 1, hint: "first meeting" },
    { q: "My name ___ Anna.", choices: ["am","is","are","be"], answerIdx: 1, hint: "name + is" },
    { q: "How do you ask someone's name?", choices: ["What's your name?","Where are you?","How old are you?","What time is it?"], answerIdx: 0, hint: "asking name" },
    { q: "A: How are you? B: ___", choices: ["I'm 12 years old","I'm fine, thank you","My name is Tom","Goodbye"], answerIdx: 1, hint: "feeling response" }
  ],
  1: [
    { q: "She ___ to school every day.", choices: ["go","goes","going","went"], answerIdx: 1, hint: "She + V-s" },
    { q: "___ you like ice cream?", choices: ["Do","Does","Is","Are"], answerIdx: 0, hint: "You + Do" },
    { q: "He ___ breakfast at 7 a.m.", choices: ["have","has","having","had"], answerIdx: 1, hint: "He + has" },
    { q: "Does she play tennis? No, she ___.", choices: ["don't","doesn't","isn't","aren't"], answerIdx: 1, hint: "Does → doesn't" },
    { q: "They ___ homework after school.", choices: ["does","do","doing","did"], answerIdx: 1, hint: "They + do" }
  ],
  2: [
    { q: "What does a doctor do?", choices: ["Teaches students","Treats patients","Grows plants","Flies planes"], answerIdx: 1, hint: "hospital work" },
    { q: "A cat can ___.", choices: ["fly","swim","climb trees","drive"], answerIdx: 2, hint: "cats climb" },
    { q: "Who works on a farm?", choices: ["Pilot","Teacher","Farmer","Nurse"], answerIdx: 2, hint: "farm worker" },
    { q: "A ___ flies an airplane.", choices: ["doctor","pilot","chef","driver"], answerIdx: 1, hint: "airplane job" },
    { q: "Which animal says 'meow'?", choices: ["Dog","Cat","Bird","Cow"], answerIdx: 1, hint: "cat sound" }
  ],
  3: [
    { q: "What are you ___ now?", choices: ["do","does","doing","did"], answerIdx: 2, hint: "are + V-ing" },
    { q: "She ___ reading a book.", choices: ["am","is","are","be"], answerIdx: 1, hint: "She + is" },
    { q: "Are they playing football? Yes, they ___.", choices: ["is","am","are","do"], answerIdx: 2, hint: "they are" },
    { q: "I ___ watching TV right now.", choices: ["am","is","are","be"], answerIdx: 0, hint: "I + am" },
    { q: "He isn't sleeping. He ___ studying.", choices: ["am","is","are","be"], answerIdx: 1, hint: "He + is" }
  ],
  4: [
    { q: "The cat is ___ the table.", choices: ["under","at","of","from"], answerIdx: 0, hint: "below table" },
    { q: "The book is ___ the desk.", choices: ["behind","under","on","next"], answerIdx: 2, hint: "top surface" },
    { q: "Where is the dog? It's ___ the box.", choices: ["at","on","in","of"], answerIdx: 2, hint: "inside box" },
    { q: "What do you say when someone helps you?", choices: ["Excuse me","Sorry","Thank you","Goodbye"], answerIdx: 2, hint: "gratitude word" },
    { q: "The chair is ___ to the door.", choices: ["next","in","under","on"], answerIdx: 0, hint: "beside/near" }
  ]
};
```