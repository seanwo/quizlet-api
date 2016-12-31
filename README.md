# Quizlet API

A simple REST module that returns [ECMAScript 6 promises](http://www.ecma-international.org/ecma-262/6.0/#sec-promise-constructor) for [Quizlet API calls](https://quizlet.com/api/2.0/docs/api-intro).

![alt text](https://quizlet.com/static/ThisUsesQuizlet-Blue.png "Powered by Quizlet")

This module sorts the returned data based on when the data was last create, accessed, or modified.
This module also has methods that prune down the data returned since the JSON blobs returned from the Quizlet API can sometime be too much for simple tasks.
