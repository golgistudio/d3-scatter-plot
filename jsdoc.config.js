{
    "source": {
        "include": [ "./demoApp/src/js" ],
        "exclude": [ "./demoApp/src/js/__tests__" ],
        "includePattern": ".+\\.js(doc)?$",
        "excludePattern": "(^|\\/|\\\\)_"
    },
    "opts": {
    "template": "templates/default",  // same as -t templates/default
        "encoding": "utf8",               // same as -e utf8
        "destination": "./demoApp/quality/docs/",          // same as -d ./out/
        "recurse": true                // same as -r
    }
}