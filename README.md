#Angelnalysis

Angelnalysis is a single-page web application that algorithmically analyzes a user's AngelList profile. Drawing data from the University of Pennsylvania's <a href=http://wwbp.org/>Word Well-Being Project</a>, Angelnalysis applies the statistical correlations the researchers at Penn found between words used on social media and personality types to the text written by an AngelList user. In order to collect all this text, Angelnalysis hits upwards of 50 AngelList API endpoints in an asynchronous fashion. Once the algorithm has yielded the results, Angelnalysis renders the data graphically using D3. 

I built Angelnalysis using full-stack JavaScript: Node.js with a PostgreSQL database, Sequelize.js, Express.js, various Node packages(most notably async and passport-angellist-e_and_m, which I built using source code from another authentication system), Backbone.js, Handlebars.js, and D3.js. I also formatted and styled with HTML5 and CSS3. My sole API was <a href=https://angel.co/api>the AngelList API</a>, but I became intimately familiar with it through extended use.  

Please find Angelnalysis, deployed to Heroku, <a href=http://angelnalysis.herokuapp.com/>here</a>.
