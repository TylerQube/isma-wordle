# ISMordle

A built-from-scratch spinoff of Wordle, remixed to use slang and terminology from the Illinois Math & Science Academy!

Each day, an express backend served a new ISMA-related word to a front-end built with HTML, SCSS, and TypeScript.

Though now defunct since my high school graduation, ISMordle provided over 100 daily words for hundreds of students in early 2022!

# Features

ISMordle provides a responsive word grid and built-in keyboard, the latter of which updates after each guess to show already used letters.

Similar to Wordle, users can share their score using a text output!

ISMA Wordle (2/22/2022) (3/6)  <br/>
🟩⬛🟨⬛🟨⬛⬛ <br/>
🟩🟩🟨⬛⬛⬛⬛ <br/>
🟩🟩🟩🟩🟩🟩🟩 <br/>

Unlike Wordle, each solution word is stored in the backend, preventing users from inspecting front-end code to find the solution.

# Running locally
After cloning the repository to your local machine, run the following commands to build the minified javascript and serve the webpage locally

```
npm install
npm run build
npm run start
```
Make sure to provide a file containing your own list of words, the official daily list is excluded from version control to prevent cheating!
