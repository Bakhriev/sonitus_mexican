const menuInit = () => {
	const burger = document.querySelector('.burger');
	const mobileMenu = document.querySelector('.mobile-menu');

	burger.addEventListener('click', () => {
		burger.classList.toggle('active');
		mobileMenu.classList.toggle('active');
	});
};

menuInit();

const tabInit = () => {
	const tabNavs = document.querySelectorAll('.tab__nav button');
	const tabItems = document.querySelectorAll('.tab__content .tab__item');

	if (!tabNavs.length || !tabItems.length) return;

	tabNavs[0].classList.add('active');
	tabItems[0].classList.add('active');

	tabNavs.forEach(nav => {
		nav.addEventListener('click', () => {
			if (!nav.classList.contains('active')) {
				tabNavs.forEach(item => item.classList.remove('active'));
				tabItems.forEach(item => item.classList.remove('active'));

				const index = nav.dataset.tab;
				nav.classList.add('active');
				tabItems[index].classList.add('active');
			}
		});
	});
};

tabInit();

const swiper = new Swiper('.swiper', {
	slidesPerView: 'auto',
	spaceBetween: 16,
	// Navigation arrows
	navigation: {
		nextEl: '.slider-buttons__next',
		prevEl: '.slider-buttons__prev',
	},
});

const overlay = document.querySelector('.overlay');
const body = document.body;

function modal(modalSelector, triggersSelector) {
	const modal = document.querySelector(modalSelector);
	const triggers = document.querySelectorAll(triggersSelector);
	const destroyers = modal?.querySelectorAll('[data-destroyer]');

	let isModalActive = false;

	let trap;
	let currentTrigger;

	if (!modal | !triggers.length | !destroyers) return;

	function show(e) {
		currentTrigger = e.currentTarget;

		modal.classList.add('active');

		isModalActive = true;

		trap = focusTrap(modal);
	}

	function hide(trigger) {
		if (!isModalActive) return;

		modal.classList.remove('active');

		isModalActive = false;

		// removeListener
		trap();

		// focus on leave
		currentTrigger.focus();
	}

	triggers.forEach(trigger => {
		trigger.addEventListener('click', show);
	});

	destroyers.forEach(destroyer => {
		destroyer.addEventListener('click', hide);
	});

	modal.addEventListener('click', e => {
		if (e.target === modal) hide();
	});

	window.addEventListener('keydown', e => {
		if (isModalActive && e.key === 'Escape') hide();
	});
}

const focusTrap = parent => {
	if (!parent) return;

	const focusableSelectors = [
		'button',
		'a[href]',
		'input',
		'select',
		'textarea',
	];

	const items = parent.querySelectorAll(focusableSelectors.join(','));

	if (!items.length) return;

	let index = 0;
	items[index].focus();

	const handleKeydown = e => {
		if (e.key !== 'Tab') return;

		e.preventDefault();

		if (e.shiftKey) {
			index = index === 0 ? items.length - 1 : index - 1;
		} else {
			index = index === items.length - 1 ? 0 : index + 1;
		}

		items[index].focus();
	};

	parent.addEventListener('keydown', handleKeydown);

	// for cleanup
	return () => {
		parent.removeEventListener('keydown', handleKeydown);
	};
};

modal('[data-modal="search-modal"]', '[data-trigger="search-modal"]');
