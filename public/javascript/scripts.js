
document.addEventListener("DOMContentLoaded", function(event) {

    var question = '<p>Hi, let me know which category of products you would like me to search for you, by writting category name after "Category". e.g. "Category drones"</p>';

    var output = document.getElementById('chatbox');		// store id="output" in output variable
    output.innerHTML = question;	// ouput first question

    $("#submitMsgForm").submit(function(e){
        e.preventDefault();
        bot();
    });

    function bot() {
        var usermsg = document.getElementById("usermsg").value;

        var para = document.createElement('p');

        var node = document.createTextNode(usermsg);
        para.appendChild(node);
        output.appendChild(para);
        para.className += "userMsgClass";

        $.post("bot/",
            {
                usermsg: usermsg
            },
            function(data, status){
                console.log("Data: " + data + "\nStatus: " + status);
                let result = JSON.parse(data);
                if(result.length ===0){
                    let paragraph = document.createElement("p");
                    paragraph.appendChild(document.createTextNode("Sorry, couldn't find anything by those words. Try something like: Category drones"));
                    output.appendChild(paragraph);
                }else{
                    let paragraph = document.createElement("p");
                    paragraph.appendChild(document.createTextNode("Our products under "+JSON.parse(data)[0]['Category']+" category are the following:"));
                    output.appendChild(paragraph);

                    makeUL(JSON.parse(data));

                    let endParagraph = document.createElement("p");
                    endParagraph.appendChild(document.createTextNode("Did you found what you were looking for? Let me know if you want to search anything else."));
                    output.appendChild(endParagraph);
                }

            });

    }
    function makeUL(array) {

        for(var i = 0; i < array.length; i++) {

            var div = document.createElement("div");
            div.className += "botProductBlock";

            div.appendChild(createImg(array[i]['Category']));

            var itemName = createP();
            var itemBrand = createP();
            var itemPrice = createP();

            itemName.appendChild(document.createTextNode(array[i]['ProductName']));
            itemBrand.appendChild(document.createTextNode("Brand: "+array[i]['Brand']));
            itemPrice.appendChild(document.createTextNode("Subscription Price: "+ array[i]['SubscriptionPlanPrice']+"€"));

            div.appendChild(itemName);
            div.appendChild(itemBrand);
            div.appendChild(itemPrice);

            output.appendChild(div);

        }
    }

    function createP() {
        return document.createElement('p');
    }
    function createImg(category){
        let image;
        if(category.toLowerCase() === "drones") image = "drones";
        if(category.toLowerCase() === "computing") image = "computing";
        if(category.toLowerCase() === "gaming & vr") image = "gaming";
        if(category.toLowerCase() === "phones & tablets") image = "phones";
        if(category.toLowerCase() === "smart home") image = "smartHome";
        if(category.toLowerCase() === "wearables") image = "wearables";

        var img = document.createElement("IMG");
        img.setAttribute("src", "images/"+image+".jpg");
        img.className += "botImg";

        return img;
    }

});