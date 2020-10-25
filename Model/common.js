exports.getDateNowAsString = () => {
    let date = new Date();
    let month = date.getMonth() + 1;
    return date.getFullYear() + "-" + month  + "-" +  date.getDate();
}

exports.checkIfUserCanLogIn = (sessionDate, currentNumOfNumOfTranctions, allowedNumOfTranctions) => {
    let currentDate =this.getDateNowAsString();
     
    if (currentNumOfNumOfTranctions == undefined && sessionDate == undefined) {
        return { userCanLogIn: false };
    }
    else if (currentNumOfNumOfTranctions <= parseInt(allowedNumOfTranctions.numOfTranctions) && Date.parse(sessionDate) <= Date.parse(currentDate)) {
        return { userCanLogIn: true };
    }
    else {
        return { userCanLogIn: false };
    }
}
