var args = arguments[0] || {};

var group_id = args.group_id;
var group_name = args.group_name;
var group_private = args.group_private;

$.header_title.text = group_name + ' Members';

Alloy.Globals.API.getGroupMembers(group_id, function(result) {
	var tableData = [];
	for (i in result.data) {
		if (result.data[i].id != Alloy.Globals.currentUser.user_info.id) {
			tableData.push(Alloy.createController('groups/group_member_list_row', {
				user : result.data[i],
				group_id: group_id,
				group_private: group_private,
				tableView: $.groupMemberListTable
			}).getView());
		}
	}
	$.groupMemberListTable.setData(tableData);
}, function(error) {
	alert('Could not retrieve members list, please try again later');
});
