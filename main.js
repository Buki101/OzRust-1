const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

function setTab(tabName) {
  tabs.forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.tab === tabName);
  });

  panels.forEach((panel) => {
    panel.classList.toggle('is-visible', panel.id === tabName);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setTab(tab.dataset.tab));
});

setTab('home');
