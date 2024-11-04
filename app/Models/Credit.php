<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 *
 *
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Credit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Credit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Credit query()
 * @mixin \Eloquent
 */
class Credit extends Model
{
    public const RATE = 7.9;

    protected $fillable = ['term','debtor_id', 'amount','amountLeft'];

    public function debtor()
    {
        return $this->belongsTo(Debtor::class);
    }

}
