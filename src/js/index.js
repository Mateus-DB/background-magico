
const setLoading = (isLoading) => {

    const btnSpan = document.querySelector('#generate-btn');

    if (isLoading) {
        btnSpan.innerHTML = 'Gerando Background...'
    } else {
        btnSpan.innerHTML = 'Gerar Background Mágico'
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('.form-group');
    const textArea = document.querySelector('#description');
    const htmlCode = document.querySelector('#html-code');
    const cssCode = document.querySelector('#css-code');
    const preview = document.getElementById('preview-section');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const valueTextArea = textArea.value.trim();

        if (!valueTextArea) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5678/webhook/gerador-fundo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ valueTextArea })
            })

            const data = await response.json();
            htmlCode.textContent = data.code || "";
            cssCode.innerHTML = data.style || "";

            preview.style.display = 'block';
            preview.innerHTML = data.code || "";

            console.log(data.code)

            let styleTag = document.getElementById('dynamic-style');

            if (styleTag) styleTag.remove();

            if (data.style) {
                styleTag = document.createElement('style');
                styleTag.id = 'dynamic-style';

                styleTag.textContent = data.style;
                document.head.appendChild(styleTag);
            }




        } catch (error) {
            console.log('Erro ao gerar o fundo', error)
            htmlCode.innerHTML = 'Não gerou o codigo'
            cssCode.innerHTML = 'Não gerou o codigo'
            preview.innerHTML = ""
        } finally {
            setLoading(false);
        }

    })

    textArea.addEventListener('keydown', (event) => {

        if (event.key === 'Enter') {
            event.preventDefault();

            form.requestSubmit();
        }
    })
})

