function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

const element = (tag, classes = [], content) => {
    const node = document.createElement(tag);
    if (classes.length) {
        node.classList.add(...classes);
    }
    if (content) {
        node.textContent = content;
    }
    return node;
}

const noop = () => {}

export function upload(selector, options = {}) {
    let files = [];
    const onUpload = options.onUpload ? options.onUpload : noop;
    const input = document.querySelector(selector);

    if (options.multi) {
        input.setAttribute('multiple', true);
    }

    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','));
    }

    const preview = element('div', ['preview']);
    const open = element('button', ['btn'], 'Открыть');
    const upload = element('button', ['btn', 'primary'], 'Загрузить');
    upload.style.display = 'none';

    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', upload);
    input.insertAdjacentElement('afterend', open);

    const triggerInput = () => input.click();
    const changeHadler = (event) => {
        if (!event.target.files.length) {
            return;
        }

        files = Array.from(event.target.files);
        preview.innerHTML = '';
        upload.style.display = 'inline';
        files.forEach((file) => {
            if (!file.type.match('image')) {
                return
            }

            const reader = new FileReader();

            reader.onload = (ev) => {
                preview.insertAdjacentHTML('afterbegin', `
                  <div class="preview-img">
                    <div class="preview-img-remove" data-name="${file.name}">&times;</div>
                    <img src="${ev.target.result}"  alt="${file.name}" />
                    <div class="preview-img-info">
                      <span>${file.name}</span>
                      ${bytesToSize(file.size)}
                    </div>
                  </div>`)
            }

            reader.readAsDataURL(file);
        })
    }

    const removeHandler = (event) => {
        if (!event.target.dataset.name) {
            return
        }

        const { name } = event.target.dataset;
        files = files.filter((file) => file.name !== name);

        const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview-img');
        block.classList.add('removing');
        setTimeout(() => block.remove(), 300);
        if (!files.length) {
            upload.style.display = 'none';
        }
    }

    const clearPreview = (el) => {
        el.style.bottom = '0px';
        el.innerHTML = '<div class="preview-info-progress"></div>'
    }

    const uploadHandler = () => {
        preview.querySelectorAll('.preview-img-remove').forEach(e => e.remove());
        const previewInfo = preview.querySelectorAll('.preview-img-info');
        previewInfo.forEach(clearPreview);
        onUpload(files, previewInfo);
    }

    open.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHadler);
    preview.addEventListener('click', removeHandler);
    upload.addEventListener('click', uploadHandler);
}