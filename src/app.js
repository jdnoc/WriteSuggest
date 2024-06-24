import { marked } from 'marked';
import localforage from 'localforage';
import OpenAI from 'openai';

document.addEventListener("DOMContentLoaded", function () {

    let openai;

    const editor = document.getElementById("editor");
    const preview = document.getElementById("preview");
    const promptsDiv = document.getElementById("prompts");
    const promptsContent = document.getElementById("promptsContent");
    const progressBar = document.getElementById("progressBar");
    const progressBarInner = progressBar.querySelector('.progress-bar');
    const autoSuggestToggle = document.getElementById("autoSuggestToggle");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const toggleButton = document.getElementById("toggleButton");
    const copyButton = document.getElementById("copyButton");
    const downloadButton = document.getElementById("downloadButton");
    const deleteButton = document.getElementById("deleteButton");
    const apiSettingsButton = document.getElementById("apiSettingsButton");
    const saveApiSettingsButton = document.getElementById("saveApiSettings");
    const apiServiceSelect = document.getElementById("apiService");
    const apiKeyInput = document.getElementById("apiKey");
    const rememberKeyCheckbox = document.getElementById("rememberKey");
    const warningText = document.getElementById("warningText");

    // Initialize the modal
    const modalElement = document.getElementById('apiSettingsModal');
    new bootstrap.Modal(modalElement);

    let timeout;
    let progressTimeout;
    let progressInterval;
    let saveTimeout;
    let isPreviewMode = false;
    let isDarkMode = false;
    let isAutoSuggestOn = true;
    let currentApiKey = null;
    let currentApiService = 'openai';

    // Initialize LocalForage
    localforage.config({
        name: 'WriteSuggest'
    });

    // Load saved settings on startup
    loadSavedText();
    loadApiSettings();
    loadToggleSettings();
    loadSavedPrompts();

    editor.addEventListener("input", handleInput);
    autoSuggestToggle.addEventListener("click", toggleAutoSuggest);
    darkModeToggle.addEventListener("click", toggleDarkMode);
    toggleButton.addEventListener("click", togglePreview);
    copyButton.addEventListener("click", copyToClipboard);
    downloadButton.addEventListener("click", downloadMarkdown);
    deleteButton.addEventListener("click", confirmDelete);
    apiSettingsButton.addEventListener("click", openApiSettingsModal);
    saveApiSettingsButton.addEventListener("click", saveApiSettings);

    // Add event listener to toggle warning text
    rememberKeyCheckbox.addEventListener("change", function () {
        if (rememberKeyCheckbox.checked) {
            warningText.style.display = 'block';
            warningText.classList.remove('text-muted');
            warningText.classList.add('text-danger');
        } else {
            warningText.style.display = 'none';
            warningText.classList.remove('text-danger');
            warningText.classList.add('text-muted');
        }
    });

    // Initialize dark mode based on user preference or system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        toggleDarkMode();
    }

    function handleInput() {
        clearTimeout(timeout);
        clearTimeout(progressTimeout);
        clearInterval(progressInterval);
        resetProgressBar();
        promptsContent.innerHTML = "";

        if (isAutoSuggestOn) {
            progressTimeout = setTimeout(startProgressBar, 2000);
            timeout = setTimeout(showSuggestions, 5000);
        }
        saveTimeout = setTimeout(saveText, 1000);
    }

    function startProgressBar() {
        progressBar.classList.remove('d-none');
        progressBarInner.style.width = '0%';
        progressBarInner.setAttribute('aria-valuenow', 0);
        let progress = 0;
        progressInterval = setInterval(() => {
            progress += 1;
            progressBarInner.style.width = `${progress}%`;
            progressBarInner.setAttribute('aria-valuenow', progress);
            if (progress >= 100) {
                clearInterval(progressInterval);
            }
        }, 30); // 3000ms / 100 = 30ms per 1%
    }

    function resetProgressBar() {
        progressBar.classList.add('d-none');
        progressBarInner.style.width = '0%';
        progressBarInner.setAttribute('aria-valuenow', 0);
    }

    function saveText() {
        localforage.setItem('savedText', editor.value)
            .catch(err => console.error('Error saving text:', err));
    }

    async function loadSavedText() {
        try {
            const savedText = await localforage.getItem('savedText');
            if (savedText) {
                editor.value = savedText;
                if (isAutoSuggestOn) {
                    progressTimeout = setTimeout(startProgressBar, 2000);
                    timeout = setTimeout(showSuggestions, 5000);
                }
            }
        } catch (err) {
            console.error('Error loading saved text:', err);
        }
    }

    async function loadToggleSettings() {
        try {
            const darkMode = await localforage.getItem('isDarkMode');
            if (darkMode !== null) {
                isDarkMode = darkMode;
                if (isDarkMode) {
                    document.body.classList.add('dark-mode');
                    darkModeToggle.innerHTML = '<i class="bi bi-sun"></i>';
                    darkModeToggle.title = "Switch to Light Mode";
                }
            }

            const autoSuggest = await localforage.getItem('isAutoSuggestOn');
            if (autoSuggest !== null) {
                isAutoSuggestOn = autoSuggest;
                autoSuggestToggle.innerHTML = isAutoSuggestOn ? '<i class="bi bi-stop-circle"></i>' : '<i class="bi bi-magic"></i>';
                autoSuggestToggle.title = isAutoSuggestOn ? "Turn Off Auto Suggestions" : "Turn On Auto Suggestions";
            }
        } catch (err) {
            console.error('Error loading toggle settings:', err);
        }
    }

    async function loadSavedPrompts() {
        try {
            const savedPrompts = await localforage.getItem('savedPrompts');
            if (savedPrompts) {
                promptsContent.innerHTML = savedPrompts.map(prompt => `<div>${prompt}</div>`).join('');
            }
        } catch (err) {
            console.error('Error loading saved prompts:', err);
        }
    }

    function savePrompts(prompts) {
        localforage.setItem('savedPrompts', prompts)
            .catch(err => console.error('Error saving prompts:', err));
    }

    function confirmDelete() {
        if (confirm("Are you sure you want to delete all text? This action cannot be undone.")) {
            editor.value = '';
            localforage.removeItem('savedText')
                .then(() => console.log('Text deleted successfully'))
                .catch(err => console.error('Error deleting text:', err));
            promptsContent.innerHTML = '';
            resetProgressBar();
        }
    }

    function toggleAutoSuggest() {
        isAutoSuggestOn = !isAutoSuggestOn;
        autoSuggestToggle.innerHTML = isAutoSuggestOn ? '<i class="bi bi-stop-circle"></i>' : '<i class="bi bi-magic"></i >';
        autoSuggestToggle.title = isAutoSuggestOn ? "Turn Off Auto Suggestions" : "Turn On Auto Suggestions";
        localforage.setItem('isAutoSuggestOn', isAutoSuggestOn)
            .catch(err => console.error('Error saving auto-suggest setting:', err));
        if (isAutoSuggestOn) {
            progressTimeout = setTimeout(startProgressBar, 2000);
            timeout = setTimeout(showSuggestions, 5000);
        } else {
            clearTimeout(timeout);
            clearTimeout(progressTimeout);
            clearInterval(progressInterval);
            resetProgressBar();
            promptsContent.innerHTML = "";
        }
    }

    function togglePreview() {
        isPreviewMode = !isPreviewMode;
        if (isPreviewMode) {
            preview.innerHTML = marked.parse(editor.value);
            editor.classList.add("d-none");
            preview.classList.remove("d-none");
            promptsDiv.style.display = 'none';
            toggleButton.innerHTML = '<i class="bi bi-pencil"></i>';
            toggleButton.title = "Edit";
        } else {
            editor.classList.remove("d-none");
            preview.classList.add("d-none");
            promptsDiv.style.display = 'block';
            toggleButton.innerHTML = '<i class="bi bi-eye"></i>';
            toggleButton.title = "Preview";
        }
    }

    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode');
        darkModeToggle.innerHTML = isDarkMode ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
        darkModeToggle.title = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
        localforage.setItem('isDarkMode', isDarkMode)
            .catch(err => console.error('Error saving dark mode setting:', err));
    }

    function downloadMarkdown() {
        const content = editor.value;
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(editor.value).then(() => {
            const originalContent = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="bi bi-check-lg"></i>';
            copyButton.title = "Copied!";
            setTimeout(() => {
                copyButton.innerHTML = originalContent;
                copyButton.title = "Copy to Clipboard";
            }, 1000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    async function showSuggestions() {
        const text = editor.value;
        if (text.trim().length === 0) {
            promptsContent.innerHTML = "";
            resetProgressBar();
            return;
        }
        try {
            const suggestions = await getSuggestions(text);
            promptsContent.innerHTML = suggestions.map(suggestion => `<div>${suggestion}</div>`).join('');
            savePrompts(suggestions);
            resetProgressBar();
        } catch (error) {
            console.error('Error getting suggestions:', error);
            promptsContent.innerHTML = '<div>Error fetching suggestions. Please check your API settings.</div>';
            resetProgressBar();
        }
    }

    async function getSuggestions(text) {
        if (!openai) {
            return ["Please set up your OpenAI API key in the settings."];
        }

        // Extract the most recent part of the text
        const recentText = text.slice(-500); // Adjust the number of characters as needed

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI writing assistant. Your task is to provide three different short and simple prompts or questions to help the user continue their writing. Each suggestion should be no more than one sentence and easy to understand. Respond with a JSON array of strings without any additional formatting or code fences."
                    },
                    {
                        role: "user",
                        content: `Here is what I have written so far: "${text}".\n\nBased on the recent part: "${recentText}", please provide three short and simple suggestions to help me continue writing as a JSON array of strings.`
                    }
                ],
                temperature: 0.7,
                max_tokens: 100,
            });

            let suggestionsContent = response.choices[0].message.content.trim();

            // Remove code fences if they are present
            if (suggestionsContent.startsWith('```') && suggestionsContent.endsWith('```')) {
                suggestionsContent = suggestionsContent.slice(3, -3).trim();
            }

            // Remove any leading or trailing non-JSON characters
            suggestionsContent = suggestionsContent.replace(/^[^\[]*/, '').replace(/[^\]]*$/, '');

            // Parse the response content as a JSON array
            const suggestions = JSON.parse(suggestionsContent);

            return suggestions;
        } catch (error) {
            console.error('Error getting suggestions:', error);
            return [`Error: ${error.message}`];
        }
    }

    function openApiSettingsModal() {
        const modalElement = document.getElementById('apiSettingsModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }

    async function saveApiSettings() {
        const apiKey = apiKeyInput.value;
        const rememberKey = rememberKeyCheckbox.checked;

        if (apiKey) {
            openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });
        }

        if (rememberKey) {
            const encryptedKey = await encryptApiKey(apiKey);
            await localforage.setItem('encryptedApiKey', encryptedKey);
        } else {
            await localforage.removeItem('encryptedApiKey');
        }

        const modalElement = document.getElementById('apiSettingsModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
    }

    async function loadApiSettings() {
        const encryptedKey = await localforage.getItem('encryptedApiKey');

        if (encryptedKey) {
            const apiKey = await decryptApiKey(encryptedKey);
            openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });
            rememberKeyCheckbox.checked = true;
            warningText.style.display = 'block';
            warningText.classList.remove('text-muted');
            warningText.classList.add('text-danger');
        }
    }

    async function encryptApiKey(apiKey) {
        const encoder = new TextEncoder();
        const data = encoder.encode(apiKey);
        const key = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encryptedData = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            data);
        return {
            key: await window.crypto.subtle.exportKey("jwk", key),
            iv: Array.from(iv),
            data: Array.from(new Uint8Array(encryptedData))
        };
    }

    async function decryptApiKey(encryptedData) {
        const key = await window.crypto.subtle.importKey(
            "jwk",
            encryptedData.key,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        const decryptedData = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: new Uint8Array(encryptedData.iv) },
            key,
            new Uint8Array(encryptedData.data)
        );
        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
    }
});
