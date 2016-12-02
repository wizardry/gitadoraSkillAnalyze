var React  = require('react');
var $ = require('jquery');

module.exports = class ScrapingFormView extends React.Component {
	constructor(props){
		super(props);
	}
	submitHandler(e){
		e.preventDefault();
		console.log('submit');
	}
	render(){
		return (
			<form action="" id="analyzeForm" onSubmit={this.submitHandler}>
                <p className="sectionHeadline">
                    <span>データ取得</span>
                </p>
                <p className="serchTypeWrap">
                    <select id="userData_searchType" name="searchType">
                        <option selected="selected" value="1">
                            IDで入力する
                        </option>
                        <option value="2">
                            URLで入力する
                        </option>
	                </select>
                </p>
                <div className="js-formToggleWrap toggleWrap toggleForm">
                    <div className="js-formToggleVal2 toggleArea">
                        <p className="formHeadline">
                            URL
                        </p>
                        <input className="block" id="userData_url" name="getData" type="text" />
                    </div>
                    <div className="js-formToggleVal1 toggleArea current">
                        <p className="formHeadline">
                            利用サイト
                        </p>
                        <p className="formline">
                            <select id="userData_WebType" name="siteType">
                                <option value="xv-od" disabled="">
                                    http://xv-s.heteml.jp - OverDrive
                                </option>
                                <option value="mimi-tb">
                                    http://tri.gfdm-skill.net - TriBoost
                                </option>
                            </select>
                        </p>
                        <p className="formHeadline">
                            PART / ID
                        </p>
                        <p className="formline">
                            <select id="userData_part" name="idType">
                                <option value="g">
                                    GUITARFREAKS
                                </option>
                                <option value="d">
                                    DRUMMANIA
                                </option>
                            </select>
                            <input className="em2" id="userData_id" name="getData" type="text" />
                        </p>
                    </div>
                </div>
                <div className="buttonWrap">
                    <label className="submitBase primary" htmlFor="getDataTrigger">送信</label>
                    <input id="getDataTrigger" type="submit" />
                </div>
            </form>
        );
	}
}