{
    'name': 'Arrow Key Navigation in List View',
    'version': '18.0.1.0.0',
    'category': 'Extra Tools',
    'summary': 'Use Arrow Keys to navigate cells in editable list views — Up, Down, Left, Right like a spreadsheet',
    'description': """
Arrow Key Navigation in List View
===================================
Navigate cells in editable list views using arrow keys, just like a spreadsheet.

Features:
- Up / Down arrow keys to move between rows (same column)
- Left / Right arrow keys to move between cells (same row)
- Smart cursor: Left/Right moves within text first, then jumps to adjacent cell
- Enter key moves to the next row (Odoo default enhanced)
- Works on all editable list views across every model
- No configuration needed — install and it works
    """,
    'author': 'Steven Marp',
    'website': 'https://apps.odoo.com/apps/modules/browse?repo_maintainer_id=512936',
    'license': 'LGPL-3',
    'depends': ['web'],
    'assets': {
        'web.assets_backend': [
            'sm_arrow_key_navigation/static/src/css/arrow_key_navigation.css',
            'sm_arrow_key_navigation/static/src/js/arrow_key_navigation.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
    'images': ['static/description/banner.gif'],
    'price': 8.96,
    'currency': 'USD',
}
