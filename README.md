# Webhtml2pdf
#### Small webapp to upload html files, apply some DOM changes to them and finally convert them to pdf. 

#### Tailored to specific pages from IOC's (Institut Obert de Catalunya) moodle. 

### Usage
Just drop the file you want to convert to pdf into the box under options, or click on it to search your file directory manually. A prompt to print your page to pdf will be displayed when the file has been uploaded and edited.

### Setting the app up:
if you want to start the app locally, you'll need [git](https://git-scm.com/) and the latest version of [node](https://nodejs.org/en/).
Just clone the repository into your filesystem:

    git clone https://github.com/ramonVD/webhtml2pdf.git


Enter the app directory:

    cd webhtml2pdf
    
    
And istall node_modules:


    npm install
    
    
To start the local server:


    npm start
    
    
Finally, to create a production build:


    npm run build
    
    
(These are all standard create-react-app settings)
    
### What does it do?

The app works by inserting the cleaned DOM of the uploaded page into a hidden iframe and calling the iframe print function when its finished loading. 

Note that I tried multiple html to pdf converting libraries and in the end I feel this is the best compromise. It may not be.

CORS problems may arise if you're trying to load elements from domains different than the one the app is on, if their headers don't allow it.



