import { marked } from 'marked';
import localforage from 'localforage';
import OpenAI from 'openai';

document.addEventListener("DOMContentLoaded", function () {

    let openai;

    const editor = document.getElementById("editor");
    const preview = document.getElementById("preview");
    const promptsDiv = document.getElementById("prompts");
    const promptsContent = document.getElementById("promptsContent");
    const autoSuggestToggle = document.getElementById("autoSuggestToggle");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const toggleButton = document.getElementById("toggleButton");
    const copyButton = document.getElementById("copyButton");
    const downloadButton = document.getElementById("downloadButton");
    const deleteButton = document.getElementById("deleteButton");
    const apiSettingsButton = document.getElementById("apiSettingsButton");
    const saveApiSettingsButton = document.getElementById("saveApiSettings");
    const apiKeyInput = document.getElementById("apiKey");
    const rememberKeyCheckbox = document.getElementById("rememberKey");
    const warningText = document.getElementById("warningText");
    const refreshPromptsButton = document.getElementById("refreshPrompts");

    // Initialize the modal
    const modalElement = document.getElementById('apiSettingsModal');
    new bootstrap.Modal(modalElement);

    let timeout;
    let isPreviewMode = false;
    let isDarkMode = false;
    let isAutoSuggestOn = true;
    let isApiKeyStored = false;

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
    editor.addEventListener("paste", handlePaste);
    apiKeyInput.addEventListener('focus', handleApiKeyInputFocus);
    apiKeyInput.addEventListener('blur', handleApiKeyInputBlur);
    refreshPromptsButton.addEventListener("click", instantRefreshPrompts);

    // Add event listener to toggle warning text
    rememberKeyCheckbox.addEventListener("change", function () {
        if (this.checked) {
            warningText.style.display = 'block';
            warningText.classList.remove('text-muted');
            warningText.classList.add('text-danger');
        } else {
            warningText.style.display = 'none';
            warningText.classList.remove('text-danger');
            warningText.classList.add('text-muted');

            // Clear the API key input and reset stored state when unchecked
            apiKeyInput.value = '';
            apiKeyInput.type = 'password';
            isApiKeyStored = false;
        }
    });

    // Initialize dark mode based on user preference or system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        toggleDarkMode();
    }

    function handlePaste(e) {
        setTimeout(() => {
            handleInput();
            // Optionally, trigger suggestions immediately after paste
            if (isAutoSuggestOn) {
                clearTimeout(timeout);
                showSuggestions();
            }
        }, 0);
    }

    function handleInput() {
        clearTimeout(timeout);

        const text = editor.value.trim();

        if (text.length > 0 && isAutoSuggestOn) {
            timeout = setTimeout(() => {
                getSuggestions(text).then(suggestions => {
                    setTimeout(() => {
                        displaySuggestions(suggestions);
                    }, 2000); // Display after 2 more seconds (5 seconds total)
                });
            }, 3000); // Start getting suggestions after 3 seconds
        } else {
            promptsContent.innerHTML = "";
        }
        saveTimeout = setTimeout(saveText, 1000);

        // Reset the refresh button icon
        refreshPromptsButton.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
    }

    function displaySuggestions(suggestions) {
        promptsContent.innerHTML = suggestions.map(suggestion => `<div class="suggestion">${suggestion}</div>`).join('');
        savePrompts(suggestions);

        // Fade in and slide up animation
        const suggestionElements = promptsContent.querySelectorAll('.suggestion');
        suggestionElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100); // Stagger the animation for each suggestion
        });
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
        }
    }

    function toggleAutoSuggest() {
        isAutoSuggestOn = !isAutoSuggestOn;
        autoSuggestToggle.innerHTML = isAutoSuggestOn ? '<i class="bi bi-stop-circle"></i>' : '<i class="bi bi-magic"></i >';
        autoSuggestToggle.title = isAutoSuggestOn ? "Turn Off Auto Suggestions" : "Turn On Auto Suggestions";
        localforage.setItem('isAutoSuggestOn', isAutoSuggestOn)
            .catch(err => console.error('Error saving auto-suggest setting:', err));
        if (isAutoSuggestOn) {
            timeout = setTimeout(showSuggestions, 5000);
        } else {
            clearTimeout(timeout);
            promptsContent.innerHTML = "";
        }
    }

    function instantRefreshPrompts() {
        clearTimeout(timeout); // Clear any pending timeouts
        const text = editor.value.trim();
        if (text.length > 0) {
            showSuggestions();
        } else {
            promptsContent.innerHTML = "<div>Please start writing to get suggestions.</div>";
        }
    }

    function togglePreview() {
        isPreviewMode = !isPreviewMode;
        if (isPreviewMode) {
            preview.innerHTML = marked.parse(editor.value);
            editor.classList.add("d-none");
            preview.classList.remove("d-none");
            // promptsDiv.style.display = 'none';
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
        const text = editor.value.trim();
        if (text.length === 0) {
            promptsContent.innerHTML = "";
            return;
        }

        promptsContent.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';

        try {
            const suggestions = await getSuggestions(text);
            displaySuggestions(suggestions);
        } catch (error) {
            console.error('Error getting suggestions:', error);
            promptsContent.innerHTML = '<div>Error fetching suggestions. Please check your API settings.</div>';
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

        // Show dummy text if a key is stored
        if (isApiKeyStored) {
            apiKeyInput.value = '••••••••••••••••';
            apiKeyInput.type = 'text';
        } else {
            apiKeyInput.value = '';
            apiKeyInput.type = 'password';
        }

        modal.show();
    }

    async function saveApiSettings() {
        const apiKey = apiKeyInput.value;
        const rememberKey = rememberKeyCheckbox.checked;

        if (apiKey && apiKey !== '••••••••••••••••') {
            openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });
            isApiKeyStored = true;
        }

        if (rememberKey && apiKey !== '••••••••••••••••') {
            const encryptedKey = await encryptApiKey(apiKey);
            await localforage.setItem('encryptedApiKey', encryptedKey);
        } else if (!rememberKey) {
            await localforage.removeItem('encryptedApiKey');
            isApiKeyStored = false;
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
            isApiKeyStored = true;
            rememberKeyCheckbox.checked = true;
            warningText.style.display = 'block';
            warningText.classList.remove('text-muted');
            warningText.classList.add('text-danger');
        } else {
            isApiKeyStored = false;
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

    function handleApiKeyInputFocus() {
        if (isApiKeyStored) {
            apiKeyInput.value = '';
            apiKeyInput.type = 'password';
        }
    }

    function handleApiKeyInputBlur() {
        if (isApiKeyStored && apiKeyInput.value === '') {
            apiKeyInput.value = '••••••••••••••••';
            apiKeyInput.type = 'text';
        }
    }
});