export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "full",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		components: [
			{
				webform: {
					id: "newsletter",
					style: "",
					buttons: "",
					elements: {
						email: {
							validation: {
								required: true,
								pattern: "/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$/i",
								patternError: "Le champ email n'est pas valide",
							},
							type: "text",
							label: "email",
							isMultiple: false,
						},
						buttons: {
							actions: {
								actions: {
									text: "Envoyer",
									type: "webform_actions",
								},
							},
							reset: {
								hidden: true,
								text: "Reset",
							},
						},
					},
					autosave: false,
				},
				newsletterTitle: "La Bourse de Casablanca vient chez vous.",
				newsletterSubtitle: "Recevez nos insights, Publications, Avis & insructions.",
				footer_top: "main",
				footer_bottom: "footer-bottom",
				logo: [
					{
						_default: {
							_original: "/logo.png",
							dark: "/logo.png",
						},
						file_name: "logo_vactory.png",
						meta: {
							target_id: "34",
							alt: "Vactory Logo",
							title: "",
							width: "524",
							height: "138",
						},
					},
				],
				copyrights: {
					value: {
						"#text":
							'<p>Agence digitale <a href="https://www.void.fr" target="_blank">VOID</a></p>\n',
						"#format": "full_html",
					},
				},
			},
		],
		/* The below variables are for static footer */
		staticFooterMenu: [
			{
				id: "d64a3573-d41a-44ac-93cb-0d5d964c0adb",
				title: "Modules",
				options: {
					attributes: {
						class: [],
						id: "menu-link-mty2mdi0mty1mq",
					},
				},
				url: "",
				below: [
					{
						id: "19ce5adf-2a13-4efc-a494-0b80da803339",
						title: "Appels d'offres ( A venir )",
						options: {
							attributes: {
								class: [],
								id: "menu-link-mty2mdi0mtcyoa",
							},
							external: true,
						},
						url: "https://google.com",
					},
					{
						id: "4d1f9089-d763-4ec7-b697-2a876d3984b3",
						title: "Evènements",
						options: {
							attributes: {
								class: [],
								id: "menu-link-mty2mdi0mty2nq",
							},
						},
						url: "/en/events",
					},
					{
						id: "c81df2ee-a09a-408a-8675-7799a1d32632",
						title: "FAQ",
						options: {
							attributes: {
								class: [],
								id: "menu-link-mty2mdi0mtcwmq",
							},
						},
						url: "/en/faq",
					},
					{
						id: "568234d5-572b-440b-9098-0ff1867448fc",
						title: "Glossaire",
						options: {
							attributes: {
								class: [],
								id: "menu-link-mty2mdi0mty5mq",
							},
						},
						url: "/en/glossary",
					},
					{
						id: "c6683cb3-833a-4f69-a41b-0993becd83a9",
						title: "Offres d'emploi ( en cours )",
						options: {
							attributes: {
								class: [],
								id: "menu-link-mty2mdi0mtcwoq",
							},
							external: true,
						},
						url: "https://google.com",
					},
				],
			},
			{
				id: "106c07fb-b065-4bfa-9bf5-d389dd76c5f2",
				title: "Pages",
				options: {
					attributes: {
						class: [],
						id: "menu-link-mty2mdi0mtu3na",
					},
				},
				url: "",
				below: [
					{
						id: "3150bacb-0b77-4d2c-9bd9-0c9e9ee28d02",
						title: "Google",
						options: {
							attributes: {
								class: [],
								id: "menu-link-mty2mdi0mtu5nw",
							},
							external: true,
						},
						url: "https://google.com",
					},
					{
						id: "271cb91b-a78f-432c-b8fd-16d136294439",
						title: "Templates liste",
						options: {
							attributes: {
								class: [],
								id: "menu-link-mty2mdi0mtu4mw",
							},
						},
						url: "/en/template-liste",
					},
					{
						id: "e226c6f4-4f33-41d7-b5e4-b9bee0e90d32",
						title: "formulaire",
						options: {
							attributes: {
								id: "menu-link-mty3otmynjm1mg",
							},
						},
						url: "/en/formulaire",
					},
				],
			},
			{
				id: "b82da059-a8be-4ec6-b02e-dc043ddbac8a",
				title: "Section services",
				options: {
					attributes: {
						class: [],
						id: "menu-link-mty2mdi0mtuznw",
					},
				},
				url: "",
				below: [
					{
						id: "93f9d652-b076-461f-951e-50b6aaf0257b",
						title: "Actualités",
						options: {
							attributes: {
								class: [],
								id: "menu-link-mty2mdi0mtu1nw",
							},
						},
						url: "/en/news",
					},
					{
						id: "2be527c8-7c31-4ab5-b501-11f0325f8a4c",
						title: "Void",
						options: {
							attributes: {
								class: [],
								id: "menu-link-mty2mdi0mtyxmq",
								target: "_blank",
							},
							external: true,
						},
						url: "https://void.fr",
					},
				],
			},
		],
		staticFooterBottomMenu: [
			{
				id: "6428516e-cac8-4ba1-bacb-348b4b71aa10",
				title: "Templates",
				options: {
					attributes: {
						id: "menu-link-mty2mdiwodq2nw",
					},
				},
				url: "/en/template-liste",
			},
			{
				id: "537aafea-b881-4a5e-8391-1194b889475c",
				title: "Sliders",
				options: {
					attributes: {
						class: [],
						id: "menu-link-mty1otawnte1nq",
					},
				},
				url: "/en/sliders",
			},
		],
		isStatic: true,
	},
}
