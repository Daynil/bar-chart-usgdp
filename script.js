'use strict';
require('./styles.css');
const d3 = require('d3');
const axios = require('axios');

const w = 600;
const h = 350;

window.onload = init();

function init() {
	let jsonData;
	axios.get('./data.json').then(res => {
		jsonData = res.data;
		plotData(jsonData);
	});
}

function plotData(jsonData) {
	// Data is an array of arrays, ['quarter date string', gdp number]
	let dataset = jsonData.data;
	console.log(dataset);
	let xScale = d3.scale.ordinal()
					.domain(d3.range(dataset.length))
					.rangeRoundBands([0, w], 0.01);
	let yScale = d3.scale.linear()
					.domain([0, d3.max(dataset, d => d[1])])
					.range([0, h]);
	let svg = d3.select('#chart')
				.append('svg')
				.attr('width', w)
				.attr('height', h);
				
	svg.selectAll('rect')
		.data(dataset)
		.enter()
		.append('rect')
		.each(d => console.log(d))
		.attr('x', (d, i) => xScale(i))
		.attr('y', d => h - yScale(d[1]))
		.attr('width', xScale.rangeBand())
		.attr('height', d => yScale(d[1]))
		.attr('fill', 'rgb(0, 0, 255)');
}