class Jury extends GovernmentPower{

    // Force citizens to miss work, lose income (and possibly their homes), 
    // and be prisoners in the courthouse for an undetermined amount of time
    constructor(){
        this.jurors = [];
        for(var i=0; i<=12; i++){
            // let citizenID = this.getRandomCitizen();
            let citizenID = this.getRandomCitizenOnWatchList();
            let juror = this.conscriptCitizen(citizenID);
            juror.isSlave = true;
            if(!juror.appear() || juror.refuse()){
                this.kidnap(juror);
                juror.money -= 5000.00;
                juror.clothing = [];
                this.search(juror);
                this.brutalize(juror);
                this.imprison(juror);
                juror.clothing = this.prisonJumpSuits.pop();
                juror.employmentStatus = false;
                juror.personalBelongings = [];
            } else {
                this.search(juror);
                this.confine(juror);
                this.confiscate(juror.personalBelongings.phone);
                this.interrogate(juror);
                if(juror.isDisinterested || juror.isAngry || juror.isSycophantic){
                    this.jurors.push(juror);
                } else {
                    this.free(juror);
                }
            }
        }
    }

    // Euphemise theft by the state
    confiscate(item){
        this.steal(item);
    }

    // Intrusion, theft, and sexual assault by the state
    search(citizen){
        citizen.body.hasOwnership = false;
        this.detain(citizen);
        this.sexuallyAssault(citizen);
        let belongings = citizen.personalBelongings;
        for(var i=0; i<belongings.length; i++){
            let item = belongings[i];
            if((this.prohibitedItems.indexOf(item) != -1) || (item.value > 100)){
                this.confiscate(item);
                citizen.personalBelongings[item].hasOwnership = false;
                if(item.value > 100){
                    this.sellAtPoliceAuction(item);
                }
            }
        }
    }

    // The trial. In a criminal trial, the prosecution always has the advantage.
    // In a civil trial, it's the party with more money.
    holdTrial(){
        while(this.trialInProgress){
            this.judge.reprimand(this.jurors);
            this.judge.threaten(this.jurors);
            this.judge.intimidate(this.jurors);
            for(var i=0; i<this.jurors.length; i++){
                let juror = this.jurors[i];
                if(!this.judge.likes(juror)){
                    this.kidnap(juror);
                    juror.money -= 10000.00;
                    juror.clothing = [];
                    this.search(juror);
                    this.brutalize(juror);
                    this.imprison(juror);
                    juror.clothing = this.prisonJumpSuits.pop();
                    juror.employmentStatus = false;
                    juror.personalBelongings = [];
                }
            }
        }
        this.jurors.deliberate().then(verdict => {
            if(verdict.isUnanimous){
                for(var i=0; i<this.jurors.length; i++){
                    this.free(this.jurors[i]);
                }
            } else {
                this.hung = true;
                this.trial.isMistrial = true;
            }
        });
    }

    // A way to fight back against this tyrannical and antiquated system
    nullify(defendant,unjustLaw){
        defendant.isGuilty = false;
        unjustLaw = null;
        let verdict = {
            unjustLaw: unjustLaw,
            defendant: defendant
        }
        return verdict;
    }

    sendMessage(){
        return "You are not free.  What you were told in school about the United States being a 'free country' is a lie.  The government owns you.";
    }

}
