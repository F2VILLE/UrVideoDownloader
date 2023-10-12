const submit = document.querySelector("#submit")
const input = document.querySelector("#url")

submit.onclick = () => {
    const url = input.value
    if (url.trim() != "") {
        submit.setAttribute("disabled", "")
        fetch("/download?url=" + encodeURI(url))
        .then((res) => {
            res.json().then(r => {
                if (r.error) {
                    alert(r.error)
                }
            })
            submit.removeAttribute("disabled")
            input.value = ""
        }).catch(e => {
            alert(e)
            submit.removeAttribute("disabled")
        })
    }
}