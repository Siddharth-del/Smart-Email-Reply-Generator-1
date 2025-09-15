console.log("Email Writer");

function getEmailContent() {
  const selectors = [
    '.h7',
    '.a3s.ail',
    '.gmail_quote',
    '[role="presentation"]'
  ];

  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) {
      return content.innerText.trim();
    }
  }
  return '';
}

function findComposeToolbar() {
  const selectors = ['.btC', '.aDh', '[role="dialog"]', '.gU.Up'];
  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) {
      console.log("Toolbar found with selector:", selector);
      return toolbar;
    }
  }
  console.log("Toolbar not found");
  return null;
}

function createToneDropdown() {
  const toneSelect = document.createElement('select');
  toneSelect.className = 'ai-tone-dropdown';
  toneSelect.innerHTML = `
    <option value="professional">Professional</option>
    <option value="friendly">Friendly</option>
    <option value="casual">Casual</option>
    <option value="short">Short & Polite</option>
  `;
  return toneSelect;
}

function createAIButton() {
  const button = document.createElement('div');
  button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
  button.style.marginRight = '8px';
  button.innerHTML = "AI Reply";
  button.setAttribute('role', 'button');
  button.setAttribute('data-tooltip', 'Generate AI Reply');
  return button;
}

function injectButton() {
  const existingDropdown = document.querySelector('.ai-tone-dropdown');
  const existingButton = document.querySelector('.ai-reply-button');
  if (existingDropdown && existingButton) {
    // Buttons are already injected, do nothing
    return;
  }

  const toolbar = findComposeToolbar();
  if (toolbar) {
    const toneSelect = createToneDropdown();
    const button = createAIButton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () => {
      try {
        button.innerHTML = 'Generating...';
        button.disabled = true;

        const emailContent = getEmailContent();
        const selectedTone = toneSelect.value;
        console.log("Captured email content:", emailContent, "Tone:", selectedTone);

        const response = await fetch('http://localhost:8080/api/email/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emailContent: emailContent,
            tone: selectedTone
          })
        });

        if (!response.ok) throw new Error("API Request Failed");

        const generatedReply = await response.text();
        console.log("Generated reply:", generatedReply);

        const composeBox = document.querySelector(
          '[role="textbox"][g_editable="true"]'
        );

        if (composeBox) {
          composeBox.focus();
          document.execCommand('insertText', false, generatedReply);
        }

      } catch (error) {
        console.error("AI Reply Error:", error);
        alert("Failed to generate reply. Please try again.");
      } finally {
        button.innerHTML = 'AI Reply';
        button.disabled = false;
      }
    });

    toolbar.insertBefore(button, toolbar.firstChild);
    toolbar.insertBefore(toneSelect, button);
  }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);
    const hasComposeElements = addedNodes.some(node =>
      node.nodeType === Node.ELEMENT_NODE &&
      (node.matches('.aDh,.btC,[role="dialog"]') ||
        node.querySelector('.aDh,.btC,[role="dialog"]'))
    );

    if (hasComposeElements) {
      console.log("Compose Window Detected.");
      injectButton();
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });