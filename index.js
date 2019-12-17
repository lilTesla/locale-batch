const serverConfigLocation = "C:\\Flowfinity\\FlowfinityActions\\config\\config.xml";
const webConfigLocation = "C:\\Users\\daniel\\source\\repos\\default\\Web\\Web.config";
const xml2js = require('xml2js');
const builder = new xml2js.Builder();
const fs = require("fs");
const prompt = require("prompt");
const childProc = require('child_process');

fs.access(serverConfigLocation, fs.constants.F_OK, err => {
    console.log(err ? "config.xml not found" : "config.xml exists");
});

fs.readFile(serverConfigLocation, "utf-8", (err, data) => {
    if (!err) {
        const parseString = require('xml2js').parseString;
        parseString(data, function (err, config) {
            const appProps = config["configuration"]["HTTPServer"][0]["ApplicationRealm"][0]["Application"][0]["ApplicationProperties"];
            const localeProp = appProps.find(prop => prop.$.Name === "locale");
            console.log("current locale is " + localeProp.$.Value);

            prompt.start();
            prompt.get(['localeName'], function (err, result) {
                console.log('Command-line input received:');
                if(result['localeName'] !== "") {
                    localeProp.$.Value = result['localeName'];
                }

                const xml = builder.buildObject(config);
                fs.writeFile(serverConfigLocation, xml, err => {
                    if (!err) {
                        console.log("Written");
                        console.log("Stopping Flowfinity Actions");
                        childProc.exec('net stop FAS0', function (err) {
                            if (!err) {
                                console.log("Flowfinity Actions stopped");
                                console.log("Stopping Flowfinity Server");
                                childProc.exec('net stop FWP0', function (err) {
                                    if (!err) {
                                        console.log("Flowfinity Server stopped");
                                        console.log("Starting Flowfinity Server");
                                        childProc.exec('net start FWP0', function (err) {
                                            if (!err){
                                                console.log("Flowfinity Server started");
                                                console.log("Starting Flowfinity Actions");
                                                childProc.exec('net start FAS0', function (err) {
                                                    if (!err){
                                                        console.log("Flowfinity Actions started");
                                                        console.log("Touching Web.config");
                                                        try {
                                                            let time = new Date();
                                                            fs.utimesSync(webConfigLocation, time, time);
                                                            console.log('everything is ok!!!');
                                                            prompt.get(['Danissimo krasava?']);
                                                        } catch (err) {
                                                            fs.closeSync(fs.openSync(webConfigLocation, 'w'));
                                                            console.log("Touching Web.config error: " + err);
                                                            prompt.get(['Beda!!!']);
                                                        }
                                                    }
                                                    else{
                                                        console.log('Flowfinity Actions starting error: ' + err);
                                                        prompt.get(['Beda!!!']);
                                                    }
                                                });
                                            }
                                            else{
                                                console.log('Flowfinity Server starting error: ' + err);
                                                prompt.get(['Beda!!!']);
                                            }
                                        });
                                    }
                                    else{
                                        console.log('Flowfinity Server stopping error: ' + err);
                                        prompt.get(['Beda!!!']);
                                    }
                                });
                            }
                            else{
                                console.log('Flowfinity Actions stopping error: ' + err);
                                prompt.get(['Beda!!!']);
                            }
                        });
                    }
                    else{
                        console.log("error writing to config.xml")
                        prompt.get(['Beda!!!']);
                    }
                });
            });
        });
    }
    else{
        console.log("error reading config.xml")
        prompt.get(['Beda!!!']);
    }
});