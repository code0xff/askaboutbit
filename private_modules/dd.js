exports.getDD = (param) => {
    let dd = {
        "network_error": "통신이 원활하지 않습니다. 잠시후에 다시 시도하시기 바랍니다.",

        "menu_fail": "입력하신 메뉴는 지원되지 않는 메뉴입니다.\n" +
            "help 혹은 도움을 입력하여 메뉴를 확인해주세요.",

        "hello": "안녕하세요. Askaboutbit은 가상화폐 정보 제공을 위한 챗봇입니다.\n"+
            "help 혹은 도움을 입력하시면 이용하실 수 있는 메뉴가 제공됩니다.",

        "help": "bithumb, coinrail, korbit, upbit, coinone 다섯 거래소의 시세가 제공되며,\n" +
        "비트코인, 이더리움, 리플, 비트코인캐시, 퀀텀, 비트코인골드, 이오스, 트론, 이더리움클래식, 에이다, 네오 등 11가지 코인의 각 거래소별 시세를 확인하실 수 있습니다.\n\n" +
        "기능을 사용하시려면 거래소명이나 코인명을 한글 또는 영문코드로 입력해주세요.\n" +
        "(영문은 대소문자 구분없이 사용이 가능합니다.)\n" +
        "(ex 빗썸, bithumb or 비트코인, btc)\n\n" +
        "핫키를 사용하시면 편하게 메뉴를 사용하실 수 있습니다.\n" +
        "핫키를 사용하시려면 핫키시작을 입력해주세요.",

        "hotkey_start_success": "핫키 사용이 가능합니다. 1에서 5까지의 숫자를 이용하여 핫키를 등록해보세요.\n" +
            "핫키등록 핫키번호 메뉴 순으로 입력하여 등록하실수 있습니다.\n" +
            "등록하신 핫키 목록은 숫자 9으로 확인하실 수 있습니다.\n" +
            "(ex 핫키등록 1 bithumb)",

        "hotkey_start_fail": "이미 핫키 사용이 가능한 사용자입니다.\n" +
        "핫키등록 핫키번호 메뉴 순으로 입력하여 핫키를 사용하세요.\n" +
        "등록된 핫키는 9를 입력하시면 확인하실 수 있습니다.",

        "hotkey_register_fail1": "핫키를 사용하시려면 핫키시작을 입력해주세요.",

        "hotkey_register_fail2": "입력하신 데이터가 형식에 맞지 않습니다.\n" +
            "핫키등록 핫키번호 메뉴 순으로 입력하여 등록하실수 있습니다.\n" +
            "(ex 핫키등록 1 bithumb)",

        "hotkey_register_fail3": "정상적인 데이터가 아닙니다. 1에서 5까지의 숫자를 입력해주세요.",

        "hotkey_register_fail4": "핫키등록 핫키번호 메뉴 순으로 입력하여 등록하실수 있습니다.\n" +
            "등록하신 핫키 목록은 숫자 9으로 확인하실 수 있습니다.\n" +
            "(ex 핫키등록 1 bithumb)",

        "hotkey_call_fail1": "핫키는 1에서 5까지 가능합니다.\n" +
            "숫자 9을 입력하시면 현재 등록되어있는 핫키를 확인하실 수 있습니다.",

        "hotkey_call_fail2": "유효한 메뉴가 등록되어 있지 않습니다.\n" +
            "$1번 핫키에 유효 메뉴를 등록해주세요.",

        "hotkey_call_all": "1에서 5까지의 숫자를 입력해서 핫키를 사용하세요.",

        "all_exchanges": "현재 KRW 거래가능 $1의 시세입니다.",

        "alarm_fail": "알림기능을 사용하시려면 알림등록 거래소 코인 가격 email을 순서대로 입력해주세요.\n" +
            "(ex 알림등록 bithumb btc 10000000 askaboutbit@gmail.com)",

        "alarm_register_success": "정상적으로 알림이 등록되었습니다. 등록하신 알림은 $1로 발송됩니다.",
    };

    return dd[param];
};
