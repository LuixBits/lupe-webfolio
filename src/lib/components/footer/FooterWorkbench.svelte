<div class="bench-footer">
	<div class="skirting"></div>
	<svg class="lead" viewBox="0 0 700 110" fill="none" aria-hidden="true">
		<path
			d="M15 20c66 0 56 66 140 66h310c113 0 147-60 89-62-54-2-70 72 8 72h90"
			stroke="#090910"
			stroke-width="8"
		/>
		<path
			d="M15 18c66 0 56 66 140 66h310c113 0 147-60 89-62-54-2-70 72 8 72h90"
			stroke="#5f4d58"
			stroke-width="3"
		/>
		<g transform="translate(632 79) rotate(4)">
			<rect x="0" y="0" width="28" height="22" rx="5" fill="#36313a" stroke="#81717c" />
			<path d="M28 7h9m-9 8h9" stroke="#b4b0a7" stroke-width="3" />
			<path d="M6 5v12m5-12v12" stroke="#17151b" stroke-width="2" />
		</g>
	</svg>
</div>

<style>
	.bench-footer {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}
	.skirting {
		position: absolute;
		inset: 0 0 auto;
		height: 24px;
		background: linear-gradient(#2d2026, #775542 2px, #523b30 4px, #2b2023 19px, #17121b 20px);
		box-shadow: 0 10px 25px #09070d;
	}
	.lead {
		position: absolute;
		right: 3%;
		top: 3px;
		width: min(58rem, 70%);
		height: 95px;
	}
	@media (max-width: 40rem) {
		.lead {
			right: 3%;
			width: 65%;
		}
	}
</style>
