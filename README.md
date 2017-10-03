# Petition
<a href="https://eat-local-pledge.herokuapp.com/login" taret="_blank">See it live</a>

## Summary
An app that collects signatures for a pledge.  Front end uses HTML5 Canvas and Handlebars.  Back end uses Express.js on Node.js with Redis for caching and Postgresql for persistent storage.

## Tech Stack
* Vanilla Javascript Front-end
* Express.js on Node.js
* Express-Handlebars
* Redis
* Postgresql 
* AWS S3 (for storing signature image data)


## Features

* Login and registration. Passwords hashed using the bcrypt library. 
<img src="https://raw.githubusercontent.com/maggiewiseman/petition/master/assets/screenshots/LandingPage.png" width="400px" alt="Landing page. Shows registration" />

* Users can save and edit basic profile information
<img src="https://raw.githubusercontent.com/maggiewiseman/petition/master/assets/screenshots/profileUpdate.png" width="400px" alt="Shows that a user can update profile information." width="400px" alt="Landing page. Shows registration" />

* Users can use a a mouse or their finger (on mobile) to sign the pledge.  They have the option to delete their signature at any time. 
<img src="https://raw.githubusercontent.com/maggiewiseman/petition/master/assets/screenshots/Signature.png" width="400px" alt="Shows a signature on the signature page" />

* Cookie-session data is stored in Redis. Once a user has signed the petition a flag is set in the session data that allows them to see all the signers.

<img src="https://raw.githubusercontent.com/maggiewiseman/petition/master/assets/screenshots/allSigs.png" width="400px" alt="Shows a list of signers with links to their websites and cities." width="400px" alt="Shows page with list of all signers" />
