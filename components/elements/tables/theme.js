export const table = {
	default: {
		wrapper:
			"rounded-lg shadow-md border border-gray-50 w-full overflow-x-scroll overflow-hidden scrollbar-hide",
		table: "w-full print:max-w-full",
		scrollIndice: "table-scroll-white",
		thead: "bg-gray-25 text-left border-b border-gray-50 whitespace-nowrap",
		tbody: "whitespace-nowrap",
		tbodyRow:
			"border-y border-gray-200 first:border-t-0 last:border-b-0 print:whitespace-pre-wrap",
		th: "px-6 py-3 text-gray-500 print:font-semibold print:whitespace-pre-wrap print:px-[4px] print:text-[10px] print:break-words",
		td: "px-6 py-3 text-gray-500 print:whitespace-pre-wrap print:px-[4px] print:text-[10px] print:break-words",
	},
	dark: {
		wrapper:
			"rounded-lg shadow-sm border border-gray-600 w-full overflow-x-scroll overflow-hidden scrollbar-hide",
		scrollIndice: "table-scroll-dark",
		table: "w-full max-w-screen",
		thead:
			"bg-gray-600 text-left border-b border-gray-600 whitespace-nowrap print:bg-white",
		tbody: "bg-gray-800 whitespace-nowrap print:bg-white",
		tbodyRow:
			"border-y border-gray-600 first:border-t-0 last:border-b-0 print:whitespace-pre-wrap",
		th: "px-6 py-3 print:px-2 text-white print:text-black print:font-semibold print:whitespace-pre-wrap print:text-[10px] print:px-[4px] print:break-words",
		td: "px-6 py-3 text-white print:text-black print:whitespace-pre-wrap print:px-[4px] print:text-[10px] print:break-words",
	},
	fulldark: {
		wrapper:
			"rounded-lg shadow-sm border border-gray-600 w-full overflow-x-scroll overflow-hidden scrollbar-hide",
		scrollIndice: "table-scroll-dark",
		table: "w-full",
		thead:
			"bg-gray-600 text-left border-b border-gray-600 whitespace-nowrap print:bg-white",
		tbody: "bg-gray-800 whitespace-nowrap print:bg-white",
		tbodyRow:
			"border-y border-gray-600 first:border-t-0 last:border-b-0 print:whitespace-pre-wrap",
		th: "px-6 py-3 text-white print:text-black print:font-semibold font-normal print:whitespace-pre-wrap print:text-[10px] print:px-[4px] print:break-words",
		td: "px-6 py-3 text-white print:text-black font-normal print:whitespace-pre-wrap print:text-[10px] print:px-[4px] print:break-words",
	},
	blue: {
		wrapper:
			"rounded-lg shadow-sm border border-primary-600 w-full overflow-x-scroll overflow-hidden scrollbar-hide",
		scrollIndice: "table-scroll-dark",
		table: "w-full max-w-screen",
		thead: "bg-primary-600 text-left border-b border-primary-600 whitespace-nowrap",
		tbody: "bg-primary-700 whitespace-nowrap",
		tbodyRow:
			"border-y border-primary-600 first:border-t-0 last:border-b-0 print:whitespace-pre-wrap",
		th: "px-6 py-3 print:px-2 text-white print:text-black print:font-semibold print:whitespace-pre-wrap print:text-[10px] print:px-[4px] print:break-words",
		td: "px-6 py-3 text-white print:text-black print:whitespace-pre-wrap print:px-[4px] print:text-[10px] print:break-words",
	},
	even: {
		wrapper:
			"rounded-lg print:rounded-none shadow-md border border-gray-50 w-full overflow-x-auto overflow-hidden print:overflow-visible scrollbar-hide_",
		table: "w-full print:max-w-full",
		scrollIndice:
			"table-scroll-dark scrollbar-thin scrollbar scrollbar-thumb-primary-500 scrollbar-track-primary-100 pb-4 scrollbar-thumb-rounded-lg print:rounded-none scrollbar-track-rounded-lg print:rounded-none",
		thead: "bg-gray-25 text-left border-b border-gray-50  whitespace-nowrap",
		tbody: "whitespace-nowrap",
		tbodyRow:
			"even:bg-primary-25 border-y border-gray-50 first:border-t-0 last:border-b-0 print:whitespace-pre-wrap",
		th: "px-6 py-4 text-gray-500 print:font-semibold print:whitespace-pre-wrap print:px-[4px] print:text-[10px] print:break-words",
		td: "px-6 py-3 text-gray-500 print:whitespace-pre-wrap print:px-[4px] print:text-[10px] print:break-words",
		tfoot: "bg-blue-600 h-16",
	},
}

/*
    content: "";
    z-index: 9;
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: 58px;
    width: 3.625rem;
    height: 39px;
    height: 2.4375rem;
    background: -webkit-gradient(linear,left top,right top,from(rgba(0,0,0,0)),to(#000));
    background: -o-linear-gradient(left,rgba(0,0,0,0) 0%,#000 100%);
    background: linear-gradient(90deg,rgba(0,0,0,0) 0%,#000 100%);
*/
