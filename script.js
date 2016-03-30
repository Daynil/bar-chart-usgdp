'use strict';
require('./styles.css');
const d3 = require('d3');
const axios = require('axios');
const _ = require('lodash');

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
	let padding = 24;
	let xScale = d3.scale.ordinal()
					.domain(d3.range(dataset.length))
					.rangeRoundBands([padding, w - padding], 0.01);
	let yScale = d3.scale.linear()
					.domain([0, d3.max(dataset, d => d[1])])
					.range([h, 0]);
	
	let dataYears = extractYears(dataset);
	let xAxisFormat = d3.format("04d");
	let xAxisScale = d3.scale.linear()
						.domain([dataYears[0], dataYears[dataYears.length - 1]])
						.range([padding, w - padding]);
	
	let xAxisTicks = _.sortedUniq(dataYears)
						.filter(num => num % 5 === 0);
	
	let xAxis = d3.svg.axis().scale(xAxisScale).orient('bottom').tickValues(xAxisTicks).tickFormat(xAxisFormat);
	let yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(9);
	let svg = d3.select('#chart')
				.append('svg')
				.style('margin-top', 10 + 'px')
				.style('padding-left', 30)
				.style('padding-top', 3)
				.attr('width', 650)
				.attr('height', 400);
				
	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', `translate(0, ${h})`)
		.call(xAxis);
		
	svg.append('g')
		.attr('class', 'y axis')
		.attr('transform', `translate(${padding}, 0)`)
		.call(yAxis);
		
	svg.append('text')
		.attr('class', 'x label')
		.attr('text-anchor', 'end')
		.attr('x', w / 2)
		.attr('y', h + padding + 8)
		.text('Year');
		
	svg.append('text')
		.attr('class', 'y label')
		.attr('text-anchor', 'end')
		.style('font-size', 8 + 'px')
		.attr('x', 0)
		.attr('y', 35)
		.attr('transform', 'rotate(-90)')
		.text('US GDP (billions of dollars)')
				
	svg.selectAll('rect')
		.data(dataset)
		.enter()
		.append('rect')
		.attr('x', (d, i) => xScale(i))
		.attr('y', d => yScale(d[1]))
		.attr('width', xScale.rangeBand())
		.attr('height', d => h - yScale(d[1]));
}

/*function extractYears(dataset) {
	let numericalYearArray = []
	dataset.map(set => {
		let yearOnlyNum = parseInt(set[0].substring(0, 4));
		if (yearOnlyNum % 5 === 0) numericalYearArray.push(yearOnlyNum);
	});
	numericalYearArray = _.sortedUniq(numericalYearArray);
	console.log(numericalYearArray);
	return numericalYearArray;
}*/

function extractYears(dataset) {
	let numericalYearArray = []
	dataset.map(set => {
		let yearOnlyNum = parseInt(set[0].substring(0, 4));
		numericalYearArray.push(yearOnlyNum);
	});
	console.log(numericalYearArray);
	return numericalYearArray;
}