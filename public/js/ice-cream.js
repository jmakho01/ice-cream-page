// When the form is submitted, validate
document.getElementById('ice-cream-form').onsubmit = () => 
{    
    clearErrors();

    // Flag variable to determine if form data is valid
    let isValid = true;

    // Validate name
    let name = document.getElementById('name').value.trim();
    if(!name) {
        document.getElementById('err-name').style.display = "inline";
        isValid = false;
    }

    // Validate email
    let email = document.getElementById('email').value.trim();
    if(!email || email.indexOf("@") === -1) {
        document.getElementById('err-email').style.display = "inline";
        isValid = false;
    }

    // Validate flavor
    let flavor = document.getElementById('flavor').value.trim();
    if(flavor === "none") {
        document.getElementById('err-flavor').style.display = "inline";
        isValid = false;
    }

    // Validate cone type
    let coneButtons = document.getElementsByName("cone");
    let count = 0;
    for(let i = 0; i < coneButtons.length; i++) 
    {
        if (coneButtons[i].checked) {
            count++;
        }
    }
    if (count === 0) 
    {
        document.getElementById('err-cone').style.display = "inline";
        isValid = false;
    }

    // Return isValid flag
    return isValid;
}

function clearErrors() {
    let errors = document.getElementsByClassName("error");
    for(let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}