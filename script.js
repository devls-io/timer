class Modal{
    constructor(){
        this.modal = document.getElementById("modal")
        this.modalMessage = document.getElementById("modal-message")
        this.btnClose = document.getElementById("close-modal")
        this.init()
    }

    init(){
        this.btnClose.addEventListener("click", ()=> this.close())

        window.addEventListener("click", (e)=> {
            if(e.target === this.modal){
                this.close()
            }
        })
    }

    open(message){
        this.modal.style.display = "flex"
        this.modal.classList.add("show")
        this.modalMessage.textContent = message
    }

    close(){
        this.modal.classList.remove("show")

        setTimeout(()=> {
            this.modal.style.display = "none"
        }, 300)
    }
}

class Timer{
    constructor(display, inputs, startBtn, resetBtn, modal, alarmSound){
        // Estados
        this.interval = null
        this.remainingTime = 0
        this.isActive = false

        // Html

        this.display = display
        this.inputs = inputs
        this.startBtn = startBtn
        this.resetBtn = resetBtn
        this.modal = modal
        this.alarmSound = alarmSound

        // Méntodos
        this.init()
        this.updateButtons()
        this.updateDisplay()
    }

    init(){
        this.startBtn.addEventListener("click", ()=> this.toggle())

        this.resetBtn.addEventListener("click", ()=> this.reset())
    }

    getTimeFromInputs(){
        const hours = parseInt(this.inputs[0].value) || 0
        const minutes = parseInt(this.inputs[1].value) || 0
        const seconds = parseInt(this.inputs[2].value) || 0

        return (hours * 3600) + (minutes * 60) + seconds
    }

    toggle(){
        if(this.isActive){
            this.pause()
        } else if(this.remainingTime > 0){
            this.resume()
        } else{
            this.start()
        }
    }

    start(){
        const timeInSeconds = this.getTimeFromInputs()
        if(timeInSeconds <= 0){
            this.modal.open("Tempo inválido. Por favor insira um tempo no timer.")
            return
        }

        this.remainingTime = timeInSeconds
        this.isActive = true
        this.interval = setInterval(()=> this.countdown(), 1000)
        this.display.classList.remove("timer-inactive")
        this.updateButtons()
        this.updateDisplay()
    }

    pause(){
        clearInterval(this.interval)
        this.isActive = false
        this.updateButtons()
    }

    resume(){
        this.interval = setInterval(()=> this.countdown(), 1000)
        this.isActive = true
        this.updateButtons()
    }

    reset(){
        clearInterval(this.interval)
        this.isActive = false
        this.remainingTime = 0
        this.alarmSound.currentTime = 0
        this.inputs.forEach(input=> input.value = "")
        
        this.updateButtons()
        this.updateDisplay()
        this.display.classList.add("timer-inactive")
    }

    countdown(){
        if(this.remainingTime <= 0){
            this.endTimer()
            return
        }

        this.remainingTime--
        this.updateDisplay()
    }

    endTimer(){
        this.modal.open("O tempo acabou")
        this.alarmSound.play()
        this.reset()
    }

    // UI

    updateDisplay(){
        let h = Math.floor(this.remainingTime / 3600)
        let m = Math.floor((this.remainingTime % 3600) / 60)
        let s = this.remainingTime % 60

        this.display.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    }

    updateButtons(){
        if(this.isActive){
            this.startBtn.textContent = "Pausar"
        } else if(this.remainingTime > 0){
            this.startBtn.textContent = "Retomar"
        } else{
            this.startBtn.textContent = "Iniciar"
        }

        this.resetBtn.style.display = this.isActive || this.remainingTime > 0 ? "block" : "none"

        this.inputs.forEach(input=> input.disabled = this.remainingTime > 0)
    }


}


class App{
    constructor(){
        // Seleção dos elementos do HTML
        const display = document.getElementById("timer-display");
        const inputs = [
            document.getElementById("hours"),
            document.getElementById("minutes"),
            document.getElementById("seconds")
        ];
        const startBtn = document.getElementById("startBtn");
        const resetBtn = document.getElementById("resetBtn");
        const alarmSound = new Audio("musica-alarme.mp3");

        // Instanciação das classes
        const modal = new Modal();
        const timer = new Timer(display, inputs, startBtn, resetBtn, modal, alarmSound);
    }
}

window.addEventListener("DOMContentLoaded", ()=> new App())



