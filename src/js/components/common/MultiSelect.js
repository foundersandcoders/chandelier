"use strict";
import I from "immutable";
import IPropTypes from "react-immutable-proptypes";
import React, { Component, PropTypes } from "react";
import tidy from "../../utils/tidy";

export default class MultiSelect extends Component {
	selectChange(e) {
		let currentlySelected = [].map.call(e.target.selectedOptions, element => {
			return element.value;
		});
		this.props.onSelect(this.props.selected.get("key"), currentlySelected);
	}

	checkboxChange(e) {
		const toSelectOrDeselect = e.target.checked ? this.props.selections : [];

		this.props.onSelect(this.props.selected.get("key"), toSelectOrDeselect);
	}

	render() {
		const isCheckboxChecked = ( this.props.selected.has("options") && this.props.selections &&
			this.props.selected.get("options").size === this.props.selections.size
			);
		const selected = this.props.selected;

		return (
			<div className="multiselect-holder">
				<label className="multiselect-title">{tidy(selected.get("key"))}</label>
				<label className="multiselect-label" htmlFor={selected.get("key")}>Select all:
					<input type="checkbox" className="multiselect-checkbox"
						checked={isCheckboxChecked} onChange={this.checkboxChange.bind(this)}
						id={selected.get("key")}/>
				</label>
				<select multiple={true} value={selected.toJS().options}
					onChange={this.selectChange.bind(this)} >
						{this.props.selections.map(opt => {
								return <option key={opt}>{opt}</option>;
						})}
				</select>
			</div>
		);
	}
}

MultiSelect.propTypes = {
	onSelect: PropTypes.func.isRequired,
	selections: IPropTypes.listOf(PropTypes.string),
	selected: IPropTypes.shape({
		key: PropTypes.string,
		options: IPropTypes.listOf(PropTypes.string)
	})
};
