import {
    HomeOutlined,
    AppstoreOutlined,
    ApartmentOutlined,
    AppstoreAddOutlined,
    UserOutlined,
    VerifiedOutlined,
    AreaChartOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined,
} from '@ant-design/icons';

const menuList = [
    { title: '首页', key: 'home', isPublic: true, icon: <HomeOutlined /> },
    {
        title: '商品', key: 'sub1', icon: <AppstoreOutlined />, children: [
            { title: '品类管理', key: 'category', icon: <ApartmentOutlined /> },
            { title: '商品管理', key: 'product', icon: <AppstoreAddOutlined /> },
        ]
    },
    { title: '用户管理', key: 'user', icon: <UserOutlined /> },
    { title: '角色管理', key: 'role', icon: <VerifiedOutlined /> },
    {
        title: '图形列表', key: 'sub2', icon: <AreaChartOutlined />, children: [
            { title: '柱状图', key: 'charts/bar', icon: <BarChartOutlined /> },
            { title: '折线图', key: 'charts/line', icon: <LineChartOutlined /> },
            { title: '饼状图', key: 'charts/pie', icon: <PieChartOutlined /> },
        ]
    },

]

export default menuList