"use strict";
import React, { Component, PropTypes } from "react";
import FilterInput from "./FilterInput";
import MultiSelect from "./MultiSelect";
import yyyyMMdd from "../../utils/yyyyMMdd";

export default class Filter extends Component {

	render() {
		// use cx
		const baseClassName = "job-text-input ";
		const textFilterClassName = baseClassName + "filter";
		const dateFilterClassName = baseClassName + "date";
		const selects = Object.keys(this.props.filters.restrictions).map(restr => {
			return (
				this.props.selections[restr] ?
				<MultiSelect key={restr}
					selected={this.props.filters.restrictions[restr]}
					selections={this.props.selections[restr]}
					onSelect={this.props.restrictTo}
				/>
				: <span />
			);
		});
		return (
			<div className="table-manip">
				<div className="table-manip-col" >
					<FilterInput type="text" value={this.props.filters.filterBy}
						setFilter={this.props.setFilter} className={textFilterClassName}
						placeholder="Filter all by..."
					/>
					<FilterInput type="date" value={yyyyMMdd(this.props.filters.startDate)}
						setFilter={this.props.setStartDate} className={dateFilterClassName}
						placeholder="Start Date"
					/>
					<FilterInput type="date" value={yyyyMMdd(this.props.filters.endDate)}
						setFilter={this.props.setEndDate} className={dateFilterClassName}
						placeholder="End Date"
					/>
				</div>
				<div className="table-manip-col">
					{selects}
				</div>
		</div>
		);
	}
}

Filter.propTypes = {
	filters: PropTypes.shape({
		filterBy    : PropTypes.string,
		startDate   : PropTypes.string,
		endDate     : PropTypes.string,
		restrictions: PropTypes.objectOf(PropTypes.shape({
				key    : PropTypes.string,
				options: PropTypes.arrayOf(PropTypes.string)
			})
		)
	}),

	selections  : PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.number,
		label: PropTypes.string,
		type: PropTypes.string
	}))),

	setFilter   : PropTypes.func,
	setStartDate: PropTypes.func,
	setEndDate  : PropTypes.func,
	restrictTo  : PropTypes.func
};
