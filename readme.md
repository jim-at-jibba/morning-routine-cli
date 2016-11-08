# Morning Routine CLI tool

Little cli tool to run each morning when I open terminal. It asks a number
of questions and then creates a journal entry in [Dayone](http://dayoneapp.com/) and adds the collected
data to the journal entry. 

This currently uses [IFTTT](https://ifttt.com) but is limited to allowing only 3 questions as this
is all the maker channel allows. I may look to changing it over to Zapier.

For this to work for you, you must have an ifttt account, Dayone and an 
IFTTT receipe set up. I am gonna write a blog post detailing the whole process
and will add it here when I am done.

The IFTTT Id and the event name are stored as user preferences and so only have to 
be input once.

## How to use.

1. Clone the repo and run `npm install`.
2. To run globally, run `npm install -g` from within the project directory.
3. You could also just run it directly `node index.js`
4. Make sure the recipe is set up in IFTTT.
4. Run the tool and follow the instructions

## TODO

- Give option to delete stored preferences
- Possibly move to Zapier 
