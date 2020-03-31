class GymRunner {

    public static timeLeft: KnockoutObservable<number> = ko.observable(GameConstants.GYM_TIME);
    public static timeLeftPercentage: KnockoutObservable<number> = ko.observable(100);

    public static gymObservable: KnockoutObservable<Gym> = ko.observable(new Gym(GymLeaderName.None, [], BadgeCase.Badge.None, 0, [], ''));
    public static started: boolean;

    public static startGym(name: GymLeaderName) {
        if (name === GymLeaderName.None) {
            console.error(`Cannot start gym ${name}`);
        }

        const gym = App.game.world.getGym(name);

        this.started = false;
        this.gymObservable(gym);
        if (!gym.canAccess()) {
            Notifier.notify(`${GymLeaderName[gym.leaderName]} does not deem you a worthy opponent yet...<br>Perhaps you can convince them with more gym badges`, GameConstants.NotificationOption.danger);
            return;
        }
        if (gym instanceof Champion) {
            gym.setPokemon(player.starter);
        }
        App.game.gameState = GameConstants.GameState.idle;
        GymRunner.timeLeft(GameConstants.GYM_TIME);
        GymRunner.timeLeftPercentage(100);

        GymBattle.gym = gym;
        GymBattle.totalPokemons(gym.pokemons.length);
        GymBattle.index(0);
        GymBattle.generateNewEnemy();
        App.game.gameState = GameConstants.GameState.gym;
        this.resetGif();

        setTimeout(function () {
            this.started = true;
            this.hideGif();
        }.bind(this), GameConstants.GYM_COUNTDOWN);


    }

    private static hideGif() {
        $('#gymCountdownView').fadeOut(300);
        const $img = $('#gif-go');
        $img.hide();
    }

    public static resetGif() {
        const $img = $('#gif-go');
        $img.show();
        setTimeout(function () {
            $img.attr('src', 'assets/gifs/go.gif');
        }, 0);
    }

    public static tick() {
        if (!this.started) {
            return;
        }
        if (this.timeLeft() < 0) {
            GymRunner.gymLost();
        }
        this.timeLeft(this.timeLeft() - GameConstants.GYM_TICK);
        this.timeLeftPercentage(Math.floor(this.timeLeft() / GameConstants.GYM_TIME * 100));
    }

    public static gymLost() {
        Notifier.notify(`It appears you are not strong enough to defeat ${GymLeaderName[GymBattle.gym.leaderName]}`, GameConstants.NotificationOption.danger);
        App.game.gameState = GameConstants.GameState.town;
    }

    public static gymWon(gym: Gym) {
        Notifier.notify(`Congratulations, you defeated ${GymLeaderName[GymBattle.gym.leaderName]}!`, GameConstants.NotificationOption.success);
        this.gymObservable(gym);
        App.game.wallet.gainMoney(gym.moneyReward);
        if (!App.game.badgeCase.hasBadge(gym.badgeReward)) {
            App.game.badgeCase.gainBadge(gym.badgeReward);

            $('#receiveBadgeModal').modal('show');
        }
        GameHelper.incrementObservable(player.statistics.gymsDefeated[gym.leaderName]);
        App.game.gameState = GameConstants.GameState.town;
    }

    public static timeLeftSeconds = ko.computed(function () {
        return (Math.ceil(GymRunner.timeLeft() / 10) / 10).toFixed(1);
    })

}

document.addEventListener('DOMContentLoaded', function (event) {

    $('#receiveBadgeModal').on('hidden.bs.modal', function () {

        if (GymBattle.gym.badgeReward == BadgeCase.Badge.Soul) {
            App.game.keyItems.gainKeyItem(KeyItems.KeyItem.Safari_ticket);
        }

    });
});
