<div class="workshop-wall" aria-hidden="true">
	<div class="plaster"></div>
	<div class="corner-shadow"></div>
	<div class="picture-rail"></div>
</div>

<style>
	.workshop-wall {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		background:
			radial-gradient(ellipse at 77% 15%, #854b7520, transparent 50%),
			radial-gradient(ellipse at 15% 65%, #14182466, transparent 60%),
			linear-gradient(105deg, #221b27, #332330 62%, #231a26);
	}
	.plaster {
		position: absolute;
		inset: 0;
		background: url('/media/projects/luixbits/plaster.svg');
		opacity: 0.32;
		mix-blend-mode: soft-light;
	}
	.corner-shadow {
		position: absolute;
		inset: 0;
		box-shadow: inset 0 0 160px #100c17a6;
		background: linear-gradient(90deg, transparent 0 94%, #100c1830 94.1%, transparent 95%);
	}
	.picture-rail {
		position: absolute;
		top: 4.5rem;
		inset-inline: 0;
		height: 5px;
		background: linear-gradient(#59405155, #100b184d 2px, #694e5d24 3px, transparent);
		box-shadow: 0 8px 12px #08071126;
	}
	@media (max-width: 40rem) {
		.picture-rail {
			top: 3rem;
		}
		.corner-shadow {
			box-shadow: inset 0 0 65px #100c1780;
		}
	}
</style>
