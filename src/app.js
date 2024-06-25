import { marked } from 'marked';
import localforage from 'localforage';
import OpenAI from 'openai';
import { CreateMLCEngine } from '@mlc-ai/web-llm';

document.addEventListener("DOMContentLoaded", function () {

    let openai;
    let chat;
    let engine;

    let currentApiService = 'webllm'; // Default to webllm
    let isWebLLMLoading = false;

    let modelLoadingController = new AbortController();

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
    const apiServiceSelect = document.getElementById("apiService");

    // Initialize the modal
    const modalElement = document.getElementById('apiSettingsModal');
    new bootstrap.Modal(modalElement);

    let timeout;
    let isPreviewMode = false;
    let isDarkMode = false;
    let isAutoSuggestOn = true;
    let isApiKeyStored = false;
    let saveTimeout = null;

    // Initialize LocalForage
    localforage.config({
        name: 'WriteSuggest'
    });

    // Load saved settings on startup
    loadSavedText();
    loadApiSettings();
    loadToggleSettings();
    loadSavedPrompts();
    sortModelOptions();
    markLoadedModels();

    function sortModelOptions() {
        const select = document.getElementById('modelSelection');
        const options = Array.from(select.options);

        options.sort((a, b) => a.text.localeCompare(b.text));

        select.innerHTML = '';
        options.forEach(option => select.add(option));
    }

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
    document.getElementById('clearLLMsButton').addEventListener('click', async function () {
        if (confirm("Are you sure you want to clear cached LLMs? This action cannot be undone.")) {
            await clearCachedModels();
        }
    });
    apiServiceSelect.addEventListener('change', async function () {
        currentApiService = this.value;
        const webLlmSelect = document.getElementById('modelSelection');
        const apiKeyInputDiv = document.querySelector('#apiKey').parentElement;
        const rememberKeyCheckboxDiv = document.querySelector('#rememberKey').parentElement;

        if (currentApiService === 'webllm') {
            webLlmSelect.style.display = 'block';
            apiKeyInputDiv.style.display = 'none';
            rememberKeyCheckboxDiv.style.display = 'none';
            warningText.style.display = 'none';
        } else {
            webLlmSelect.style.display = 'none';
            apiKeyInputDiv.style.display = 'block';
            rememberKeyCheckboxDiv.style.display = 'block';
            warningText.style.display = rememberKeyCheckbox.checked ? 'block' : 'none';

            // Load API key from IndexedDB if it exists
            const encryptedKey = await localforage.getItem('encryptedApiKey');
            if (encryptedKey) {
                const apiKey = await decryptApiKey(encryptedKey);
                apiKeyInput.value = '••••••••••••••••';
                apiKeyInput.type = 'text';
                openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });
                isApiKeyStored = true;
            } else {
                apiKeyInput.value = '';
                apiKeyInput.type = 'password';
                isApiKeyStored = false;
            }
        }

        updateModelNameDisplay(); // Update the display to reflect the current API service
    });

    modelSelection.addEventListener('change', function () {
        updateModelNameDisplay();
        const selectedModelId = this.value;
        initializeWebLLM(selectedModelId);
    });

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

    editor.addEventListener("keydown", function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            instantRefreshPrompts();
        }
    });

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
            if (currentApiService === 'webllm' && isWebLLMLoading) {
                promptsContent.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div><div class="mt-2">Loading Web LLM model... Please wait.</div></div>';
            } else {
                timeout = setTimeout(() => {
                    getSuggestions(text).then(suggestions => {
                        setTimeout(() => {
                            displaySuggestions(suggestions);
                        }, 2000);
                    });
                }, 3000);
            }
        } else {
            promptsContent.innerHTML = "";
        }
        saveTimeout = setTimeout(saveText, 1000);

        refreshPromptsButton.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
    }

    function displaySuggestions(suggestions) {
        // console.log('Suggestions:', suggestions);
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

                if (!isAutoSuggestOn) {
                    promptsContent.innerHTML = "";
                }
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
        clearTimeout(timeout);
        const text = editor.value.trim();
        if (text.length > 0) {
            if (currentApiService === 'webllm' && isWebLLMLoading) {
                promptsContent.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div><div class="mt-2">Loading Web LLM model... Please wait.</div></div>';
            } else {
                showSuggestions();
            }
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
        if (currentApiService === 'webllm') {
            if (isWebLLMLoading) {
                return ["Web LLM is still loading. Please wait..."];
            }
            if (!engine) {
                await initializeWebLLM();
            }
            if (!engine) {
                return ["Failed to initialize Web LLM. Please try again."];
            }
        } else if (!openai) {
            return ["Please set up your OpenAI API key in the settings."];
        }

        const recentText = text.slice(-500);
        const messages = [
            {
                role: "system",
                content: "You are an AI writing assistant. Your task is to provide different short and simple prompts or questions to help the user continue their writing. Each suggestion should be no more than one sentence and easy to understand. Respond with a JSON array of strings without any additional formatting or code fences."
            },
            {
                role: "user",
                content: `Here is what I have written so far: "${text}".\n\nBased on the recent part: "${recentText}", please provide short and simple suggestions to help me continue writing as a JSON array of strings.`
            }
        ];

        try {
            let response;
            if (currentApiService === 'webllm') {
                response = await engine.chat.completions.create({
                    messages,
                    temperature: 0.7,
                    max_tokens: 1000,
                });
            } else {
                response = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages,
                    temperature: 0.7,
                    max_tokens: 1000,
                });
            }

            let suggestionsContent = response.choices[0].message.content.trim();
            console.log('Suggestions:', suggestionsContent);

            // Remove code fences if they are present
            if (suggestionsContent.startsWith('```') && suggestionsContent.endsWith('```')) {
                suggestionsContent = suggestionsContent.slice(3, -3).trim();
            }

            // Remove any leading or trailing non-JSON characters
            suggestionsContent = suggestionsContent.replace(/^[^\[]*/, '').replace(/[^\]]*$/, '');

            // Ensure proper JSON format by checking for missing closing bracket
            if (suggestionsContent && !suggestionsContent.endsWith(']')) {
                suggestionsContent += ']';
            }

            // Parse the response content as a JSON array
            let suggestions;
            try {
                suggestions = JSON.parse(suggestionsContent);
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                // If parsing fails, use the entire response as a suggestion
                suggestions = [suggestionsContent];
            }

            return suggestions;
        } catch (error) {
            console.error(`Error getting suggestions from ${currentApiService}:`, error);
            return [`Error: ${error.message}`];
        }
    }

    const modelList = {
        "Llama-3-8B-Instruct-q4f32_1-MLC-1k": "https://huggingface.co/mlc-ai/Llama-3-8B-Instruct-q4f32_1-MLC",
        "Llama-3-8B-Instruct-q4f16_1-MLC-1k": "https://huggingface.co/mlc-ai/Llama-3-8B-Instruct-q4f16_1-MLC",
        "Llama-3-8B-Instruct-q4f32_1-MLC": "https://huggingface.co/mlc-ai/Llama-3-8B-Instruct-q4f32_1-MLC",
        "Llama-3-8B-Instruct-q4f16_1-MLC": "https://huggingface.co/mlc-ai/Llama-3-8B-Instruct-q4f16_1-MLC",
        "Hermes-2-Pro-Llama-3-8B-q4f16_1-MLC": "https://huggingface.co/mlc-ai/Hermes-2-Pro-Llama-3-8B-q4f16_1-MLC",
        "Hermes-2-Pro-Llama-3-8B-q4f32_1-MLC": "https://huggingface.co/mlc-ai/Hermes-2-Pro-Llama-3-8B-q4f32_1-MLC",
        "Hermes-2-Pro-Mistral-7B-q4f16_1-MLC": "https://huggingface.co/mlc-ai/Hermes-2-Pro-Mistral-7B-q4f16_1-MLC",
        "Phi-3-mini-4k-instruct-q4f16_1-MLC": "https://huggingface.co/mlc-ai/Phi-3-mini-4k-instruct-q4f16_1-MLC",
        "Phi-3-mini-4k-instruct-q4f32_1-MLC": "https://huggingface.co/mlc-ai/Phi-3-mini-4k-instruct-q4f32_1-MLC",
        "Phi-3-mini-4k-instruct-q4f16_1-MLC-1k": "https://huggingface.co/mlc-ai/Phi-3-mini-4k-instruct-q4f16_1-MLC",
        "Phi-3-mini-4k-instruct-q4f32_1-MLC-1k": "https://huggingface.co/mlc-ai/Phi-3-mini-4k-instruct-q4f32_1-MLC",
        "Mistral-7B-Instruct-v0.3-q4f16_1-MLC": "https://huggingface.co/mlc-ai/Mistral-7B-Instruct-v0.3-q4f16_1-MLC",
        "Mistral-7B-Instruct-v0.3-q4f32_1-MLC": "https://huggingface.co/mlc-ai/Mistral-7B-Instruct-v0.3-q4f32_1-MLC",
        "gemma-2b-it-q4f16_1-MLC": "https://huggingface.co/mlc-ai/gemma-2b-it-q4f16_1-MLC",
        "gemma-2b-it-q4f32_1-MLC": "https://huggingface.co/mlc-ai/gemma-2b-it-q4f32_1-MLC",
        "gemma-2b-it-q4f16_1-MLC-1k": "https://huggingface.co/mlc-ai/gemma-2b-it-q4f16_1-MLC",
        "gemma-2b-it-q4f32_1-MLC-1k": "https://huggingface.co/mlc-ai/gemma-2b-it-q4f32_1-MLC",
        "Qwen2-0.5B-Instruct-q0f16-MLC": "https://huggingface.co/mlc-ai/Qwen2-0.5B-Instruct-q0f16-MLC",
        "Qwen2-0.5B-Instruct-q0f32-MLC": "https://huggingface.co/mlc-ai/Qwen2-0.5B-Instruct-q0f32-MLC",
        "Qwen2-1.5B-Instruct-q4f16_1-MLC": "https://huggingface.co/mlc-ai/Qwen2-1.5B-Instruct-q4f16_1-MLC",
        "Qwen2-1.5B-Instruct-q4f32_1-MLC": "https://huggingface.co/mlc-ai/Qwen2-1.5B-Instruct-q4f32_1-MLC",
        "Qwen2-7B-Instruct-q4f16_1-MLC": "https://huggingface.co/mlc-ai/Qwen2-7B-Instruct-q4f16_1-MLC",
        "Qwen2-7B-Instruct-q4f32_1-MLC": "https://huggingface.co/mlc-ai/Qwen2-7B-Instruct-q4f32_1-MLC",
        "stablelm-2-zephyr-1_6b-q4f16_1-MLC": "https://huggingface.co/mlc-ai/stablelm-2-zephyr-1_6b-q4f16_1-MLC",
        "stablelm-2-zephyr-1_6b-q4f32_1-MLC": "https://huggingface.co/mlc-ai/stablelm-2-zephyr-1_6b-q4f32_1-MLC",
        "stablelm-2-zephyr-1_6b-q4f16_1-MLC-1k": "https://huggingface.co/mlc-ai/stablelm-2-zephyr-1_6b-q4f16_1-MLC",
        "stablelm-2-zephyr-1_6b-q4f32_1-MLC-1k": "https://huggingface.co/mlc-ai/stablelm-2-zephyr-1_6b-q4f32_1-MLC",
        "RedPajama-INCITE-Chat-3B-v1-q4f16_1-MLC": "https://huggingface.co/mlc-ai/RedPajama-INCITE-Chat-3B-v1-q4f16_1-MLC",
        "RedPajama-INCITE-Chat-3B-v1-q4f32_1-MLC": "https://huggingface.co/mlc-ai/RedPajama-INCITE-Chat-3B-v1-q4f32_1-MLC",
        "RedPajama-INCITE-Chat-3B-v1-q4f16_1-MLC-1k": "https://huggingface.co/mlc-ai/RedPajama-INCITE-Chat-3B-v1-q4f16_1-MLC",
        "RedPajama-INCITE-Chat-3B-v1-q4f32_1-MLC-1k": "https://huggingface.co/mlc-ai/RedPajama-INCITE-Chat-3B-v1-q4f32_1-MLC",
        "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC": "https://huggingface.co/mlc-ai/TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC",
        "TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC": "https://huggingface.co/mlc-ai/TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC",
        "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC-1k": "https://huggingface.co/mlc-ai/TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC",
        "TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC-1k": "https://huggingface.co/mlc-ai/TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC"
    };

    async function initializeWebLLM(modelId = "Qwen2-1.5B-Instruct-q4f32_1-MLC") {
        isWebLLMLoading = true;
        promptsContent.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div><div class="mt-2" id="loadingText">Loading Web LLM model... This may take a few minutes.</div></div>';

        // Abort previous model loading if a new model is selected
        modelLoadingController.abort();
        modelLoadingController = new AbortController();

        try {
            const modelUrl = modelList[modelId];
            if (!modelUrl) {
                throw new Error(`No URL found for model ID "${modelId}"`);
            }

            const initProgressCallback = (initProgress) => {
                // console.log(initProgress);
                const loadingText = document.getElementById('loadingText');
                if (loadingText) {
                    loadingText.innerHTML = `Loading Web LLM model... ${Math.round(initProgress.progress * 100)}% complete.`;
                }
            };

            console.log(`Loading model ID: ${modelId}`);
            console.log(`Model URL: ${modelUrl}`);

            engine = await CreateMLCEngine(
                modelId,
                {
                    initProgressCallback: initProgressCallback,
                    modelUrl: modelUrl,
                    signal: modelLoadingController.signal // Pass the signal here
                }
            );

            promptsContent.innerHTML = '<div class="text-center text-success">Web LLM model loaded successfully!</div>';

            // Store the loaded model
            const storedModels = await localforage.getItem('storedModels') || [];
            if (!storedModels.includes(modelId)) {
                storedModels.push(modelId);
                await localforage.setItem('storedModels', storedModels);
                markLoadedModels(); // Update the selection list
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Model loading aborted');
            } else {
                console.error('Error loading Web LLM:', error);
                promptsContent.innerHTML = '<div class="text-center text-danger">Error loading Web LLM. Please try again.</div>';
                engine = null;
            }
        } finally {
            isWebLLMLoading = false;
        }
    }

    function openApiSettingsModal() {
        const modalElement = document.getElementById('apiSettingsModal');
        const modal = new bootstrap.Modal(modalElement);

        apiServiceSelect.value = currentApiService;

        if (currentApiService === 'openai') {
            if (isApiKeyStored) {
                apiKeyInput.value = '••••••••••••••••';
                apiKeyInput.type = 'text';
            } else {
                apiKeyInput.value = '';
                apiKeyInput.type = 'password';
            }
        }
        modal.show();
    }

    async function saveApiSettings() {
        const modalElement = document.getElementById('apiSettingsModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        currentApiService = apiServiceSelect.value;
        await localforage.setItem('apiService', currentApiService);

        const selectedModelId = modelSelection.value;
        await localforage.setItem('savedModelId', selectedModelId);

        if (currentApiService === 'openai') {
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
        }

        if (currentApiService === 'webllm') {
            await initializeWebLLM(selectedModelId); // Ensure model is loaded only once settings are saved
        }

        updateModelNameDisplay(); // Add this line
    }

    async function loadApiSettings() {
        const encryptedKey = await localforage.getItem('encryptedApiKey');
        const savedApiService = await localforage.getItem('apiService');
        const savedModelId = await localforage.getItem('savedModelId');

        if (savedApiService) {
            currentApiService = savedApiService;
            apiServiceSelect.value = currentApiService;
        }

        const webLlmSelect = document.getElementById('modelSelection');
        const apiKeyInputDiv = document.querySelector('#apiKey').parentElement;
        const rememberKeyCheckboxDiv = document.querySelector('#rememberKey').parentElement;

        if (currentApiService === 'webllm') {
            webLlmSelect.style.display = 'block';
            apiKeyInputDiv.style.display = 'none';
            rememberKeyCheckboxDiv.style.display = 'none';
            warningText.style.display = 'none';
            if (savedModelId) {
                modelSelection.value = savedModelId;
                await initializeWebLLM(savedModelId); // Ensure model is loaded only once on startup
            }
        } else {
            webLlmSelect.style.display = 'none';
            apiKeyInputDiv.style.display = 'block';
            rememberKeyCheckboxDiv.style.display = 'block';
            warningText.style.display = rememberKeyCheckbox.checked ? 'block' : 'none';

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

        updateModelNameDisplay(); // Add this line to update the display after loading settings
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

    async function markLoadedModels() {
        const storedModels = await localforage.getItem('storedModels') || [];
        const modelSelection = document.getElementById('modelSelection');
        const options = Array.from(modelSelection.options);

        options.forEach(option => {
            if (storedModels.includes(option.value)) {
                option.text = `✅ ${option.text.replace(/^✅\s*/, '')}`;
            } else {
                option.text = option.text.replace(/^✅\s*/, '');
            }
        });
    }

    async function clearCachedModels() {
        // Clear Cache Storage
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            for (const cacheName of cacheNames) {
                await caches.delete(cacheName);
            }
            console.log("Cache storage cleared.");
        }

        // Clear the stored model names in IndexedDB
        await localforage.removeItem('storedModels');
        console.log("Stored model names cleared from IndexedDB.");

        // Update UI and reset engine
        engine = null;
        isWebLLMLoading = false;
        promptsContent.innerHTML = '<div class="text-center text-success">Cached LLMs have been cleared from the browser.</div>';

        console.log("Cached LLMs cleared successfully");
    }

    updateModelNameDisplay();

    async function updateModelNameDisplay() {
        const modelNameDisplay = document.getElementById('modelName');
        if (currentApiService === 'webllm') {
            const selectedModel = document.getElementById('modelSelection').value;
            const storedModels = await localforage.getItem('storedModels') || [];

            if (storedModels.includes(selectedModel)) {
                modelNameDisplay.textContent = selectedModel;
            } else {
                modelNameDisplay.textContent = isWebLLMLoading ? `Loading: ${selectedModel}` : "N/A";
            }
        } else if (currentApiService === 'openai') {
            modelNameDisplay.textContent = "Open AI";
        } else {
            modelNameDisplay.textContent = "N/A";
        }
    }
});
