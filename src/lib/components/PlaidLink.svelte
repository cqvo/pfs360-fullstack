<script>
    import { onMount } from 'svelte';
  
    export let linkToken; // Pass the generated link token to this component
  
    let handler; // Plaid handler instance
  
    // Initialize the Plaid handler
    const initializePlaid = () => {
      if (typeof Plaid !== 'undefined') {
        handler = Plaid.create({
          token: linkToken, // The generated link token
          onSuccess: (public_token, metadata) => {
            console.log('Plaid success:', public_token, metadata);
            // Handle successful link
          },
          onLoad: () => {
            console.log('Plaid Link loaded');
          },
          onExit: (err, metadata) => {
            if (err) {
              console.error('Plaid exit with error:', err);
            }
            console.log('Plaid exited:', metadata);
          },
          onEvent: (eventName, metadata) => {
            console.log('Plaid event:', eventName, metadata);
          },
        });
      } else {
        console.error('Plaid script is not loaded');
      }
    };
  
    onMount(() => {
      if (linkToken) {
        initializePlaid();
      } else {
        console.error('Link token is not provided');
      }
    });
  
    // Function to open the Plaid Link interface
    const openPlaid = () => {
      if (handler) {
        handler.open();
      } else {
        console.error('Plaid handler is not initialized');
      }
    };
  </script>
  
  <button on:click={openPlaid}>Connect to Plaid</button>
  